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

# check the graphql server
def test_graphql_playground_connection(test_client):
    response = test_client.get('/api/graphql')
    assert response.status_code == 200
    assert b'GraphQL Playground' in response.data

# check the index route of the Flask App - get all exercises from mongo 
def test_index_route(test_client):
    response = test_client.get('/')
    res = json_util.loads(response.data)
    # print(res)
    assert response.status_code == 200
    assert type(res) == list
    assert type(res[0]) == dict
    assert res[0]['username'] == 'test_user'
    assert len(res) == 6

def test_graphql_server_stats_username_only(test_client):
    STATS_QUERY = """
        query Stats {
            Stats {
            success
            errors
            results {
                username 
                exercises {
                exerciseType
                totalDuration
                }
            }
            }
        }
        """
    response = test_client.post('/api/graphql', STATS_QUERY)

# check the stats route 
def test_stats_route(test_client):
    response = test_client.get('/stats')
    res = json_util.loads(response.data).get('stats')
    print(res)
    # print(test_exercises)
    assert response.status_code == 200
    assert res['success'] == True
    assert len(res['results']) == 2  # 2 test users
    assert type(res['results']) == list
    assert type(res['results'][0]) == dict

# test the user query 
def test_graphql_user_stats(test_client):
    filtered_stats_query = """
    query FilteredStats($name: String) {
        filteredStats(name: $name) {
        success
        errors
        results {
            username
            exercises {
            exerciseType
            totalDuration
            }
        }
        }
    }
    """

    response = test_client.post('/api/graphql', json={'query': filtered_stats_query, 'variables': {'name': 'stats_user'}})
    res = json_util.loads(response.data)['data']['filteredStats']
    # print(res)
    assert response.status_code == 200
    assert res['success'] == True
    assert res['results'][0]['username'] == 'stats_user'
    assert res['results'][0]['exercises'][0]['exerciseType'] == 'swimming'
    assert res['results'][0]['exercises'][0]['totalDuration'] == 35
    
def test_graphql_weekly_user_stats(test_client):
    weekly_stats_query = """
    query WeeklyStats($name: String, $start_date: String, $end_date: String)  {
        weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
        success
        errors
        results {
            username
            exercises {
            exerciseType
            totalDuration
            }
        }
        }
    }
    """
    variables = {'name': 'test_user', 'start_date': '01-01-2022', 'end_date': '07-01-2022'}
    response = test_client.post('/api/graphql', json={'query': weekly_stats_query, 'variables': variables})
    res = json_util.loads(response.data)['data']['weeklyStats']
    # print(res)
    # unpack response values in to a dict for easier handling
    exerciseList = res['results'][0]['exercises']
    exercises = {exercise['exerciseType']: exercise['totalDuration'] for exercise in exerciseList}   
    assert response.status_code == 200
    assert len(exerciseList) == 3
    assert 'cycling' in exercises.keys()
    assert exercises['running'] == 30
    