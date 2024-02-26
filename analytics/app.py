
from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from flask_pymongo import PyMongo
from flask_cors import CORS
from urllib.parse import quote_plus
from bson import json_util
import traceback
import logging
import os
from datetime import datetime, timedelta
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

    @app.route('/')
    def index():
        exercises = db.exercises.find()
        exercises_list = list(exercises)
        return json_util.dumps(exercises_list)


    @app.route('/stats')
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
        return jsonify(stats=stats)


    @app.route('/stats/<username>', methods=['GET'])
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
        return jsonify(stats=stats)


    @app.route('/stats/weekly/', methods=['GET'])
    def weekly_user_stats():
        username = request.args.get('user')
        start_date_str = request.args.get('start')
        end_date_str = request.args.get('end')

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
                        "exerciseType": "$exerciseType"
                    },
                    "totalDuration": {"$sum": "$duration"}
                }
            },
            {
                "$project": {
                    "exerciseType": "$_id.exerciseType",
                    "totalDuration": 1,
                    "_id": 0
                }
            }
        ]

        try:
            stats = list(db.exercises.aggregate(pipeline))
            return jsonify(stats=stats)
        except Exception as e:
            app.logger.error(f"An error occurred while querying MongoDB: {e}")
            traceback.print_exc()
            return jsonify(error="An internal error occurred"), 500

    return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=True, host='0.0.0.0', port=5050)