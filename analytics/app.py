
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
import traceback
import logging
from datetime import datetime, timedelta
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync, ObjectType, QueryType
from ariadne.constants import PLAYGROUND_HTML
from config_settings import Config

"""
Creates and configures the Flask application.
flask app wrapped into a function call, required to be able to have alternate  
configuration options for dev and test setups

Parameters:
    config_object (object): The configuration object to use for the Flask application. Defaults to `Config`.

Returns:
    app (Flask): The configured Flask application.
"""


def create_app(config_object=Config):
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}},
        methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

    # link config settings from config_settings.py
    app.config.from_object(config_object)

    # get database name
    mongo_db = app.config['MONGO_DB']
    print(mongo_db)

    # connect to mongoDB through Flask wrapper PyMongo - reads the MONGO URI from the app config
    mongo = PyMongo()
    mongo.init_app(app, connect=True)
    
    # get database connection
    db = mongo.cx.get_database(mongo_db)

    query = QueryType()
    type_defs = load_schema_from_path("schema.graphql")

    @app.route('/api/graphql', methods=['GET'])
    def graphql_playground():
        print('Received a get request')
        return PLAYGROUND_HTML, 200

    @app.route('/api/graphql', methods=['POST'])
    def graphql_server():
        print('Getting a request...')
        data = request.get_json()
        success, result = graphql_sync(
            schema, 
            data, 
            context_value=request, 
            debug=True
        )
        status_code = 200 if success else 400
        return jsonify(result), status_code
    
    @app.route('/')
    def index():
        exercises = db.exercises.find()
        exercises_list = list(exercises)
        return json_util.dumps(exercises_list)
    
    @app.errorhandler(Exception)
    def handle_error(e):
        app.logger.error(f"An error occurred: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500
    
    # function to resolve queries
    def resolve_query(func, **kwargs):
        try:
            loaded_stats = func(**kwargs)
            print(loaded_stats)
            payload = {"success": True, "results": loaded_stats}
        except Exception as error:
            payload = {"success": False, "errors": [str(error)]}
        return payload

    # date_format = "%d-%m-%Y"
    def parse_date(date_str, date_format="%d-%m-%Y"):
        try:
            return datetime.strptime(date_str, date_format)
        except Exception as e:
            logging.error(f"Error parsing dates: {e}")
            return jsonify(error="Invalid date format"), 400
        
    # graphql queries and resolvers     
    @query.field("weeklyGoal")
    def resolve_weekly_goal(*_, name=None):
        print("Resolving the weekly goal info")
        return resolve_query(func=user_weekly_goal, username=name)

    @query.field("caloriesGoal")
    def resolve_calories_goal(*_, name=None):
        print("Resolving the daily calories goal info")
        return resolve_query(func=calories_goal, username=name)
    
    @query.field("lastExercise")
    def resolve_last_exercise(*_, name=None):
        print("Resolving the last exercise info")
        return resolve_query(func=last_exercise, username=name)
    
    @query.field("dailyCalories")
    def resolve_daily_calories(*_, name=None, today_date=None):
        print("Resolving the daily calorie info")
        return resolve_query(func=daily_calories, username=name, today_date_str=today_date)
    
    @query.field("filteredActivityStats")
    def resolve_activity_stats(*_, name=None, activity=None):
        print("Resolving the filtered activity stats info")
        return resolve_query(func=user_activity_stats, username=name, activity=activity)

    @query.field("weeklyStats")
    def resolve_weekly_exercise_stats(*_, name=None, start_date=None, end_date=None):
        print("Resolving the exercise stats info")
        return resolve_query(func=weekly_user_stats, username=name, start_date_str=start_date, end_date_str=end_date)

    schema = make_executable_schema(type_defs, query)

    def user_activity_stats(username, activity):
        pipeline = [
            {"$match": {"username": username, "exerciseType": activity}},
            {"$group": {"_id": {"exercise": "$exerciseType"}, 
				"longestDistance": {"$max": "$distance"}, 
				"longestDuration": {"$max": "$duration"}, 
				"fastestPace": {"$min": "$pace"}, 
				"fastestSpeed": {"$min": "$speed"}, 
				"totalDistance": {"$sum": "$distance"}, 
				"totalDuration": {"$sum": "$duration"},
				"totalActivities": {"$sum": 1}}},
		    {"$project": {"_id": 0}} 
        ]

        return list(db.exercises.aggregate(pipeline))
    
    def weekly_user_stats(username, start_date_str, end_date_str):
        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str) + timedelta(days=1)  # Include the whole end day
        logging.info(f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")

        pipeline = [
                {"$match": { "username": username, "date": {"$gte": start_date, "$lt": end_date}}},
                {"$group": {"_id": {"username": "$username",
                                    "day": {"$isoDayOfWeek": {"date": "$date"}}}, # monday as start of week
                                    "count": {"$sum": 1},
                                     "dailyDuration": {"$sum": "$duration"},
                                     "dailyDistance": {"$sum": "$distance"}}
				},
				{ "$group": {"_id": "$_id.username","exerciseCount": 
                            { "$push": {"date": {"$toString": "$_id.day"},
                                        "count": "$count",
                                         "dailyDuration": "$dailyDuration",
                                        "dailyDistance": "$dailyDistance"}
						    },
                            "totalCount": {"$sum": "$count"},            
						    "totalDuration": {"$sum": "$dailyDuration"},            
						    "totalDistance": {"$sum": "$dailyDistance"}}
				},
				{ "$project": {"_id": 0, "username": "$_id", "exerciseCount": 1, "totalCount": 1, "totalDuration": 1, "totalDistance": 1} }
            ]
    
        return list(db.exercises.aggregate(pipeline))

    def user_weekly_goal(username):
        pipeline = [
            {"$match": {"username": username}},
            {"$project": { "exercise": "$exerciseType", "goal": "$goalType",
                         "unit": "$goalUnit", "value": "$goalValue", "_id": 0}
            }
        ]

        return list(db.goals.aggregate(pipeline))

    def calories_goal(username):
        pipeline = [
            {"$match": {"username": username}},
            {"$project": {"_id": 0, "value": "$caloriesGoal"}}
        ]

        return list(db.goals.aggregate(pipeline))
    
    def last_exercise(username):
        pipeline = [
            {"$match": {"username": username}},
			{"$sort": {"createdAt": -1}},
			{"$limit": 1},
			{"$project": {"_id": 0, "date": {"$dateToString": {"date": "$date", "format": "%d-%m-%Y"}}, "exercise": "$exerciseType", "duration": "$duration"}}
        ]

        return list(db.exercises.aggregate(pipeline))
    
    def daily_calories(username,today_date_str):
        start_date = parse_date(today_date_str)
        end_date = parse_date(today_date_str) + timedelta(days=1)  # time range of 1 day
        pipeline = [
            {"$match": {"username": username, "date": {"$gte": start_date, "$lt": end_date}}},
			{"$group": {"_id": {"username": "$username"}, "dailyCalories": {"$sum": "$calories"}}},
			{"$project": {"_id": 0, "daily_calories": "$dailyCalories"}}
        ]

        return list(db.exercises.aggregate(pipeline))

    return app

            
# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True, host='0.0.0.0', port=5050)