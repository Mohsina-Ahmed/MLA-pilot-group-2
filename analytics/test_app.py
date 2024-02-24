import pytest
from flask import Flask
from flask.testing import FlaskClient
from pymongo import MongoClient
import os
from app import app, db

@pytest.fixture(scope='session')
def test_client():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    flask_app = app
    
    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client: 
        # Establish an application context
        with flask_app.app_context():
            yield testing_client
    

@pytest.fixture(scope='session')
def mongo_client():
    
    client = MongoClient(os.getenv('MONGO_URI') + '/?timeoutMS=1000')  # Use a test database

    # client.admin.command('ping')
    
    # db = client['test_database']
    
    # check the connection
    # Insert some test data into the MongoDB test database before testing
    # client.test_database.exercises.insert_one({
    #     "username": "test_user",
    #     "exerciseType": "running",
    #     "duration": 30,
    #     "date": "2022-01-01"
    # })

    return client

    client.drop_database('test-database')  # Clean up the test database after tests

# @pytest.fixture
# def rollback_session(mongo_client):
#     session = mongo_client.start_session()
#     session.start_transaction()
#     database = mongo_client.list_database_names()
#     for name in database:
#         print(name)

#     try: 
#         yield session
#     finally: 
#         session.abort_transaction()

def test_mongo_connection(mongo_client):
    assert mongo_client.admin.command("ping")["ok"] == 1.0

# def test_update_mongo(mongo_client, rollback_session):
#     mongo_client.test_database.exercises.insert_one(
#         {"_id": "bad_document",
#         "description": "If this still exists, then transactions aren't working."},
#         session=rollback_session,
#         )
#     assert(
#         mongo_client.test_database.exercises.find_one(
#             {'_id': 'bad_document'}, session=rollback_session
#         )
#         != None
#     )

# def test_mongodb_fixture(mongo_client):
#     # This test will pass if MDB_URI is set to a valid connection string. 
#     print(mongo_client['test-database'].exercises.tests.find())

# def test_index_route(test_client):
#     response = test_client.get('/')
#     assert response.status_code == 200

# def test_stats_route(client, mongo_client):
#     response = client.get('/stats')
#     assert response.status_code == 200
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
