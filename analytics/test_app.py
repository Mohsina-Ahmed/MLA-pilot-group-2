import pytest
from flask import Flask
from flask.testing import FlaskClient
from pymongo import MongoClient
from app import app, db

@pytest.fixture
def client() -> FlaskClient:
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://root:cfgmla23@localhost:27017/test_database'  # Use a test database
    client = app.test_client()

    # Set up test data in the test database if needed

    yield client

@pytest.fixture
def mongo_client() -> MongoClient:
    client = MongoClient('mongodb://root:cfgmla23@localhost:27017/test_database')  # Use a test database
    # Insert some test data into the MongoDB test database before testing
    client.test_database.exercises.insert_one({
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "date": "2022-01-01"
    })
    yield client
    client.drop_database('test_database')  # Clean up the test database after tests

def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200

def test_stats_route(client, mongo_client):
    response = client.get('/stats')
    assert response.status_code == 200
    assert b'test_user' in response.data
    assert b'running' in response.data

def test_user_stats_route(client, mongo_client):
    # Insert some more test data into the MongoDB test database before testing
    mongo_client.test_database.exercises.insert_one({
        "username": "test_user",
        "exerciseType": "cycling",
        "duration": 45,
        "date": "2022-01-02"
    })

    response = client.get('/stats/test_user')
    assert response.status_code == 200
    assert b'test_user' in response.data
    assert b'cycling' in response.data

def test_weekly_user_stats_route(client, mongo_client):
    # Insert some test data into the MongoDB test database before testing
    mongo_client.test_database.exercises.insert_one({
        "username": "test_user",
        "exerciseType": "swimming",
        "duration": 60,
        "date": "2022-01-03"
    })

    response = client.get('/stats/weekly/?user=test_user&start=01-01-2022&end=07-01-2022')
    assert response.status_code == 200
    assert b'test_user' in response.data
    assert b'swimming' in response.data
