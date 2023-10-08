from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from pymongo import MongoClient
from flask_pymongo import PyMongo
from flask_cors import CORS
from urllib.parse import quote_plus
from bson import json_util
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
title = "Weekly Exercise Tracker Statistics"
heading = "MLA Flask Microservice"
user = "testuser"

client = MongoClient(os.getenv('MONGODB_URI'))
db = client.test


@app.route('/')
def index():
    exercises = db.exercises.find()
    exercises_list = list(exercises)

    return json_util.dumps(exercises_list)


@app.route('/stats')
def stats():

    pipeline = [
        {"$match": {"username": user}},
        {"$group": {
            "_id": "$exerciseType",
            "duration": {"$sum": "$duration"}
        }}
    ]

    stats = list(db.exercises.aggregate(pipeline))
    # return render_template('stats.html', stats=stats, user=user)
    return jsonify(stats=stats)


@app.route("/list")
def lists():
    exercises = db.exercises.find()
    return render_template('index.html', activities=exercises, t=title, h=heading)


if __name__ == "__main__":
    app.run(debug=True)
