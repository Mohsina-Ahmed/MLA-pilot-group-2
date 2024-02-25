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

# TODO: config testing off config > variable 
# TODO: update to graphQL

@pytest.fixture(scope='session')
def test_client():
    app = create_app(test=True)
    app.testing = True
    app.config['MONGO_DB'] = 'test_database'
    # Create a test client using the Flask application configured for testing
    with app.test_client() as testing_client: 
        # # Establish an application context
        with app.app_context():
            yield testing_client
    

@pytest.fixture(scope='session')
def mongo_client(test_client):
    
    mongo = PyMongo()
    # print(test_client.application.config['MONGO_URI'])
    mongo.init_app(test_client.application, connect=True)
    db = mongo.cx.get_database('test_database')
    # print(mongo.db)
    # client = MongoClient(os.getenv('MONGO_URI') + '/?timeoutMS=1000')  # Use a test database  
    # print(client.admin.command('ping'))
    # db = client['test_database']
    # print(db)
    # print(mongo.db.test_database)
    # collection = db['exercises']
   
    # Insert some test data into the MongoDB test database
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
    assert len(res) == 5

def test_stats_route(test_client):
    response = test_client.get('/stats')
    res = json_util.loads(response.data)['stats']
    test_user = [user for user in res if user['username'] == 'test_user'][0]
    test_exercises = test_user['exercises']
    # print(test_exercises)
    assert response.status_code == 200
    assert len(res) == 2  # 2 test users
    assert test_exercises[0]['exerciseType'] == 'running'
    assert test_exercises[0]['totalDuration'] == 60
    
def test_user_stats_route(test_client):
    response = test_client.get('/stats/stats_user')
    res = json_util.loads(response.data)
    print(res)
    assert response.status_code == 200
    assert res['stats'][0]['username'] == 'stats_user'
    assert res['stats'][0]['exercises'][0]['exerciseType'] == 'swimming'

def test_weekly_user_stats_route(test_client):
    # Insert some test data into the MongoDB test database before testing
    response = test_client.get('/stats/weekly/?user=test_user&start=01-01-2022&end=07-01-2022')
    res = json_util.loads(response.data)
    print(res)
    assert response.status_code == 200
    assert len(res['stats']) == 3
