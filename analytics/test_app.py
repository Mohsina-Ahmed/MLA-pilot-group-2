# the magic command!
# docker compose run --build --rm analytics pytest -rA --setup-show 
# -rA = get test summary for all (i.e. see stdout print statements) 
# https://doc.pytest.org/en/latest/reference/reference.html#command-line-flags

import pytest
from pymongo import MongoClient
from flask_pymongo import PyMongo
import datetime
from app import create_app
from bson import json_util
from config_settings import TestConfig

# TODO: update to graphQL

@pytest.fixture(scope='session')
def test_client():
    app = create_app(TestConfig)

    # Create a test client using the Flask application configured for testing
    with app.test_client() as testing_client: 
        # # Establish an application context
        with app.app_context():
            yield testing_client
    

@pytest.fixture(scope='session')
def mongo_client(test_client):
    
    mongo = PyMongo()
    mongo.init_app(test_client.application, connect=True)
    db = mongo.cx.get_database(test_client.application.config['MONGO_DB'])
    # print(mongo.db)
   
    # Insert some data into the test database
    db.exercises.insert_many(
    [{
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "date":  datetime.datetime(2022, 1, 1)
    }, 
    {
        "username": "test_user",
        "exerciseType": "swimming",
        "duration": 15,
        "date": datetime.datetime(2022, 1, 2)
    }, 
    {
        "username": "test_user",
        "exerciseType": "cycling",
        "duration": 25,
        "date": datetime.datetime(2022, 1, 3)
    },
    {
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "date":  datetime.datetime(2022, 1,8)
    },  
    {
        "username": "stats_user",
        "exerciseType": "swimming",
        "duration": 20,
        "date": datetime.datetime(2022, 1, 4)
    },     
    {
        "username": "stats_user",
        "exerciseType": "swimming",
        "duration": 15,
        "date": datetime.datetime(2022, 1, 5)
    }])

    yield mongo

    # Clean up the test database after tests
    mongo.cx.drop_database('test_database')  
    mongo.cx.close()

# check the connection to the mongo client 
def test_mongo_connection(mongo_client):
    assert mongo_client.cx.admin.command("ping")["ok"] == 1.0

# check the index route of the Flask App - get all exercises from mongo 
def test_index_route(test_client):
    response = test_client.get('/')
    res = json_util.loads(response.data)
    print(res)
    assert response.status_code == 200
    assert type(res) == list
    assert type(res[0]) == dict
    assert res[0]['username'] == 'test_user'
    assert len(res) == 6

# check the stats route 
def test_stats_route(test_client):
    response = test_client.get('/stats')
    res = json_util.loads(response.data).get('stats')
    print(res)
    # print(test_exercises)
    assert response.status_code == 200
    assert len(res) == 2  # 2 test users
    assert type(res) == list
    assert type(res[0]) == dict
    
# check the stats route on a specific user
def test_user_stats_route(test_client):
    response = test_client.get('/stats/stats_user')
    res = json_util.loads(response.data).get('stats')
    print(res)
    assert response.status_code == 200
    assert res[0]['username'] == 'stats_user'
    assert res[0]['exercises'][0]['exerciseType'] == 'swimming'
    assert res[0]['exercises'][0]['totalDuration'] == 35

# check the stats route for a specific week 
def test_weekly_user_stats_route(test_client):
    # Insert some test data into the MongoDB test database before testing
    response = test_client.get('/stats/weekly/?user=test_user&start=01-01-2022&end=07-01-2022')
    res = json_util.loads(response.data).get('stats')
    # unpack response values in to a dict for easier handling
    exercises = {exercise['exerciseType']: exercise['totalDuration'] for exercise in res}
    print(res)
    assert response.status_code == 200
    assert len(res) == 3
    assert 'cycling' in exercises.keys()
    assert exercises['running'] == 30
