# the magic command!
# docker compose run --build --rm analytics pytest -rA --setup-show 
# -rA = get test summary for all (i.e. see stdout print statements) 
# https://doc.pytest.org/en/latest/reference/reference.html#command-line-flags

import pytest
from flask import Flask
from flask.testing import FlaskClient
from pymongo import MongoClient
from flask_pymongo import PyMongo
import os
from app import app

@pytest.fixture(scope='session')
def test_client():
    # app, db = create_app(test=True)
    app.testing = True
    app.config['MONGO_DB'] = 'test_database'
    # Create a test client using the Flask application configured for testing
    with app.test_client() as testing_client: 
        # # Establish an application context
        with app.app_context():
            yield testing_client
    

@pytest.fixture(scope='session')
def mongo_client():
    
    # mongo = PyMongo()
    # print(test_client.application.config['MONGO_URI'])
    # mongo.init_app(test_client.application, connect=True)
    # print(mongo.db)
    client = MongoClient(os.getenv('MONGO_URI') + '/?timeoutMS=1000')  # Use a test database  
    print(client.admin.command('ping'))
    db = client['test_database']
    print(db)
    # Insert some test data into the MongoDB test database before testing
    # print(mongo.db.test_database)
    # db = mongo.cx.get_database('test_database')
    # collection = db['exercises']
    db.exercises.insert_many(
    [{
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "date": "2022-01-01"
    }, 
    {
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "date": "2022-01-02"
    }, 
    {
        "username": "test_user",
        "exerciseType": "cycling",
        "duration": 30,
        "date": "2022-01-03"
    }])

    yield client

    # Clean up the test database after tests
    # client.drop_database('test_database')  
    # client.close()

# check the connection to the mongo client 
def test_mongo_connection(mongo_client):
    assert mongo_client.admin.command("ping")["ok"] == 1.0

# check the index route of the Flask App - get all exercises from mongo 
# for now just want to check there is a response... 
# TODO: test route and data from test_database
def test_index_route(test_client):
    response = test_client.get('/')
    print(response.data)
    assert response.status_code == 200


def test_stats_route(test_client, mongo_client):
    response = test_client.get('/stats')
    assert response.status_code == 200
#     assert b'test_user' in response.data
#     assert b'running' in response.data

# def test_user_stats_route(client, mongo_client):
#     # Insert some more test data into the MongoDB test database before testing
#     mongo_client.test_database.exercises.insert_one({
#         "username": "test_user",
#         "exerciseType": "cycling",
#         "duration": 45,
#         "date": "2022-01-02"
#     })

#     response = client.get('/stats/test_user')
#     assert response.status_code == 200
#     assert b'test_user' in response.data
#     assert b'cycling' in response.data

# def test_weekly_user_stats_route(client, mongo_client):
#     # Insert some test data into the MongoDB test database before testing
#     mongo_client.test_database.exercises.insert_one({
#         "username": "test_user",
#         "exerciseType": "swimming",
#         "duration": 60,
#         "date": "2022-01-03"
#     })

#     response = client.get('/stats/weekly/?user=test_user&start=01-01-2022&end=07-01-2022')
#     assert response.status_code == 200
#     assert b'test_user' in response.data
#     assert b'swimming' in response.data
