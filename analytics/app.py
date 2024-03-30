
from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from flask_pymongo import PyMongo
from flask_cors import CORS
from urllib.parse import quote_plus
from bson import json_util
import traceback
import os
import logging
from datetime import datetime, timedelta
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync, ObjectType, QueryType
from ariadne.constants import PLAYGROUND_HTML
from config_settings import Config

# flask app wrapped into a function call, required to be able to have alternate  
# configuration options for dev and test setups

def create_app(config_object=Config):
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}},
        methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

    # link config settings from config_settings.py
    app.config.from_object(config_object)

    # get database name
    mongo_db = app.config['MONGO_DB']
    
    # connect to mongoDB through Flask wrapper PyMongo
    # reads the MONGO URI from the app config
    mongo = PyMongo()
    mongo.init_app(app, connect=True)
    
    # print(app.config['MONGO_URI'])
    print(mongo_db)
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

    @query.field("stats")
    def resolve_stats(_, info):
        try:
            print("Resolving the list stats info")
            loadedStats = stats()
            print(loadedStats)
            payload = {
                "success": True,
                "results": loadedStats
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload

    @query.field("filteredStats")
    def resolve_filteredStats(*_, name=None):
        try:
            print("Resolving the list stats info")
            loadedStats = user_stats(name)
            print(loadedStats)
            payload = {
                "success": True,
                "results": loadedStats
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload

    @query.field("weeklyStats")
    def resolve_weeklyStats(*_, name=None, start_date=None, end_date=None):
        try:
            print("Resolving the weekly stats info")
            loadedStats = weekly_user_stats(name, start_date, end_date)
            print(loadedStats)
            payload = {
                "success": True,
                "results": loadedStats
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload
    
    @query.field("exerciseStats")
    def resolve_exerciseStats(*_, name=None, start_date=None, end_date=None):
        try:
            print("Resolving the daily stats info")
            loadedStats = daily_exercise_user_stats(name, start_date, end_date)
            print(loadedStats)
            payload = {
                "success": True,
                "results": loadedStats
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload
    
    @query.field("weeklyGoal")
    def resolve_weeklyGoal(*_, name=None):
        try:
            print("Resolving the weekly goal info")
            loadedStats = user_weekly_goal(name)
            print(loadedStats)
            payload = {
                "success": True,
                "results": loadedStats
            }
        except Exception as error:
            payload = {
                "success": False,
                "errors": [str(error)]
            }
        return payload

    @app.route('/')
    def index():
        exercises = db.exercises.find()
        exercises_list = list(exercises)
        return json_util.dumps(exercises_list)
    
    # @app.route('/stats')
    def stats():
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "username": "$username",
                        "exerciseType": "$exerciseType"
                    },
                    "totalDuration": {"$sum": "$duration"}
                }
            },
            {
                "$group": {
                    "_id": "$_id.username",
                    "exercises": {
                        "$push": {
                            "exerciseType": "$_id.exerciseType",
                            "totalDuration": "$totalDuration"
                        }
                    }
                }
            },
            {
                "$project": {
                    "username": "$_id",
                    "exercises": 1,
                    "_id": 0
                }
            }
        ]

        stats = list(db.exercises.aggregate(pipeline))
        return stats


    # @app.route('/stats/<username>', methods=['GET'])
    def user_stats(username):
        pipeline = [
            {
                "$match": {"username": username}
            },
            {
                "$group": {
                    "_id": {
                        "username": "$username",
                        "exerciseType": "$exerciseType"
                    },
                    "totalDuration": {"$sum": "$duration"}
                }
            },
            {
                "$group": {
                    "_id": "$_id.username",
                    "exercises": {
                        "$push": {
                            "exerciseType": "$_id.exerciseType",
                            "totalDuration": "$totalDuration"
                        }
                    }
                }
            },
            {
                "$project": {
                    "username": "$_id",
                    "exercises": 1,
                    "_id": 0
                }
            }
        ]

        stats = list(db.exercises.aggregate(pipeline))
        return stats

    schema = make_executable_schema(type_defs, query)

    # @app.route('/stats/weekly/', methods=['GET'])
    def weekly_user_stats(username, start_date_str, end_date_str):
        # username = request.args.get('user')
        # start_date_str = request.args.get('start')
        # end_date_str = request.args.get('end')

        date_format = "%d-%m-%Y"
        try:
            start_date = datetime.strptime(start_date_str, date_format)
            end_date = datetime.strptime(end_date_str, date_format) + timedelta(days=1)  # Include the whole end day

            logging.info(f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")
        except Exception as e:
            logging.error(f"Error parsing dates: {e}")
            return jsonify(error="Invalid date format"), 400

        pipeline = [
            {
                "$match": {
                    "username": username,
                    "date": {
                        "$gte": start_date,
                        "$lt": end_date
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                    },
                    "exerciseDuration": {"$sum": "$duration"}
                }
            },
            {
                "$group": {
                    "_id": "$_id.username",
                    "exercises": {
                        "$push": {
                            "exerciseType": "$_id.exerciseType",
                            "exerciseDuration": "$exerciseDuration"
                        }
                    }
                }
            },
            {
                "$project": {
                    "username": "$_id",
                    "exercises": 1,
                    "_id": 0
                }
            }
        ]
        
        stats = list(db.exercises.aggregate(pipeline))
        return stats
    
    def daily_exercise_user_stats(username, start_date_str, end_date_str):
        # username = request.args.get('user')
        # start_date_str = request.args.get('start')
        # end_date_str = request.args.get('end')

        date_format = "%d-%m-%Y"
        try:
            start_date = datetime.strptime(start_date_str, date_format)
            end_date = datetime.strptime(end_date_str, date_format) + timedelta(days=1)  # Include the whole end day

            logging.info(f"Fetching daily count for user: {username} from {start_date} to {end_date}")
        except Exception as e:
            logging.error(f"Error parsing dates: {e}")
            return jsonify(error="Invalid date format"), 400

        pipeline = [
                {
                    "$match": {
                        "username": username,
                        "date": {
                            "$gte": start_date,
                            "$lt": end_date
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
							"username": "$username",
                            "day": {"$isoDayOfWeek": {"date": "$date"}}}, # monday as start of week
                            "count": {"$sum": 1},
                            "dailyDuration": {"$sum": "$duration"},
                            "dailyDistance": {"$sum": "$distance"}
                    }
				},
				{ "$group": {
						"_id": "$_id.username",
						"exerciseCount": {
                        "$push": {
							"date": {"$toString": "$_id.day"},
                            "count": "$count",
                            "dailyDuration": "$dailyDuration",
                            "dailyDistance": "$dailyDistance"
							}
						},
						"totalDuration": {"$sum": "$dailyDuration"},            
						"totalDistance": {"$sum": "$dailyDistance"}            
					}
				},
				{ "$project": {"_id": 0, "username": "$_id", "exerciseCount": 1, "totalDuration": 1, "totalDistance": 1} }
            ]
    
        stats = list(db.exercises.aggregate(pipeline))
        return stats

    def user_weekly_goal(username):
        pipeline = [
            {
                "$match": {"username": username}
            },
            {
                "$project": {
                    "exercise": "$exerciseType",
                    "goal": "$goalType",
                    "unit": "$goalUnit",
                    "value": "$goalValue",
                    "_id": 0
                }
            }
        ]

        stats = list(db.goals.aggregate(pipeline))
        return stats
    
    @app.errorhandler(Exception)
    def handle_error(e):
        app.logger.error(f"An error occurred: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500

    return app

            
# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True, host='0.0.0.0', port=5050)