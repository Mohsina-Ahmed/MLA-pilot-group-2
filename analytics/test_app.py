# the magic command!
# docker compose run --build --rm analytics pytest -rA --setup-show 
# -rA = get test summary for all (i.e. see stdout print statements) 
# https://doc.pytest.org/en/latest/reference/reference.html#command-line-flags

import pytest
from flask_pymongo import PyMongo
import datetime
from app import create_app
from bson import json_util
from config_settings import TestConfig

""" Fixture that creates a test client using the Flask application configured for testing. """
@pytest.fixture(scope='session')
def test_client(): 
    
    app = create_app(TestConfig)

    with app.test_client() as testing_client: 
        with app.app_context():
            yield testing_client
    

""" Fixture that initializes a PyMongo client and inserts test data into the test database. """
@pytest.fixture(scope='session')
def mongo_client(test_client):
    mongo = PyMongo()
    mongo.init_app(test_client.application, connect=True)
    db = mongo.cx.get_database(test_client.application.config['MONGO_DB'])
   
    # Insert some data into the test database
    db.exercises.insert_many(
    [{
        "username": "test_user",
        "exerciseType": "running",
        "duration": 30,
        "distance": 5,
        "pace": 6,
        "calories": 200,
        "date":  datetime.datetime(2022, 1, 1),
        "createdAt":  datetime.datetime(2022, 1, 1)
    }, 
    {
        "username": "test_user",
        "exerciseType": "swimming",
        "duration": 15,
        "distance": 1,
        "calories": 150,
        "date": datetime.datetime(2022, 1, 2),
        "createdAt": datetime.datetime(2022, 1, 2)
    }, 
    {
        "username": "test_user",
        "exerciseType": "cycling",
        "duration": 25,
        "distance": 10,
        "calories": 250,
        "date": datetime.datetime(2022, 1, 2),
        "createdAt": datetime.datetime(2022, 1, 2)
    },
    {
        "username": "test_user",
        "exerciseType": "running",
        "duration": 25,
        "distance": 5.2,
        "pace": 4.81,
        "calories": 200,
        "date":  datetime.datetime(2022, 1, 8, 14, 30, 0),
        "createdAt":  datetime.datetime(2022, 1, 8, 14, 30, 0)
    },  
    {
        "username": "test_user",
        "exerciseType": "running",
        "duration": 25,
        "distance": 6,
        "pace": 4.2,
        "calories": 200,
        "date":  datetime.datetime(2022, 1, 8, 15, 0, 0),
        "createdAt":  datetime.datetime(2022, 1, 8, 15, 0, 0)
    }, 
    {
        "username": "stats_user",
        "exerciseType": "swimming",
        "duration": 20,
        "distance": 1,
        "calories": 100,
        "date": datetime.datetime(2022, 1, 4),
        "createdAt": datetime.datetime(2022, 1, 4)
    },     
    {
        "username": "stats_user",
        "exerciseType": "swimming",
        "duration": 15,
        "distance": 1.3,
        "calories": 80,
        "date": datetime.datetime(2022, 1, 5),
        "createdAt": datetime.datetime(2022, 1, 5)
    }])

    db.goals.insert_one({
        "username": "test_user",
        "exerciseType": "Running",
        "goalType": "Duration",
        "goalUnit": "hours",
        "goalValue": 100,
        "caloriesGoal": 300,
    })

    yield mongo

    # Clean up the test database after tests
    mongo.cx.drop_database('test_database')  
    mongo.cx.close()

def test_mongo_connection(mongo_client):
    """ Test the connection to the MongoDB client. """
    assert mongo_client.cx.admin.command("ping")["ok"] == 1.0

def test_graphql_playground_connection(test_client):
    """ Test the connection to the GraphQL playground.  """
    response = test_client.get('/api/graphql')
    assert response.status_code == 200
    assert b'GraphQL Playground' in response.data

def test_index_route(test_client):
    """ Test the index route of the Flask App - get all exercises from MongoDB. """
    response = test_client.get('/')
    res = json_util.loads(response.data)
    assert response.status_code == 200
    assert type(res) == list
    assert type(res[0]) == dict
    assert res[0]['username'] == 'test_user'
    assert len(res) == 7

def test_resolve_weekly_goal(test_client):
    """
    Test the resolve_weekly_goal function in the GraphQL server.
    """
    query = """
    query weeklyGoal($name: String) {
      weeklyGoal(name: $name) {
        success
        errors
        results {
                exercise
                goal
                unit
                value
            }
        }
    }
    """
    variables = {'name': 'test_user'}
    response = test_client.post('/api/graphql', json={'query': query, 'variables': variables})
    weeklyGoal = json_util.loads(response.data)['data']['weeklyGoal']
    results = weeklyGoal['results'][0]

    assert response.status_code == 200
    assert weeklyGoal["success"] == True
    assert results["exercise"] == "Running"
    assert results["goal"] == "Duration"
    assert results["unit"] == "hours"
    assert results["value"] == 100

def test_resolve_calories_goal(test_client):
    """
    Test the resolve_calories_goal function in the GraphQL server.
    """
    query = """
    query caloriesGoal ($name: String){
        caloriesGoal(name: $name) {
        success
        errors
        results {
            value
        }
        }
    }
    """
    variables = {'name': 'test_user'}
    response = test_client.post('/api/graphql', json={'query': query, 'variables': variables})
    caloriesGoal = json_util.loads(response.data)['data']['caloriesGoal']
    results = caloriesGoal['results'][0]

    assert response.status_code == 200
    assert caloriesGoal["success"] == True
    assert results["value"] == 300

def test_resolve_last_exercise(test_client):
    """
    Test the resolve_last_exercise function in the GraphQL server.
    """
    query = """
    query lastExercise($name: String) {
      lastExercise(name: $name) {
        success
        errors
        results {
            exercise
            duration
            date
            }
        }
    }
    """
    variables = {'name': 'test_user'}
    response = test_client.post('/api/graphql', json={'query': query, 'variables': variables})
    lastExercise = json_util.loads(response.data)['data']['lastExercise']
    results = lastExercise['results'][0]
    print(results)

    assert response.status_code == 200
    assert lastExercise["success"] == True
    assert len(lastExercise["results"]) == 1
    assert results["exercise"] == "running"
    assert results["duration"] == 25
    assert results["date"] == "08-01-2022"

def test_resolve_daily_calories(test_client):
    """
    Test the resolve_daily_calories function in the GraphQL server.
    """
    query = """
    query dailyCalories($name: String, $today_date: String) {
      dailyCalories(name: $name, today_date: $today_date) {
        success
        errors
        results {
            daily_calories
            }
        }
    }
    """
    variables = {'name': 'test_user', 'today_date': '02-01-2022'}
    response = test_client.post('/api/graphql', json={'query': query, 'variables': variables})
    dailyCalories = json_util.loads(response.data)['data']['dailyCalories']
    results = dailyCalories['results'][0]

    assert response.status_code == 200
    assert dailyCalories["success"] == True
    assert results["daily_calories"] == 400


def test_filtered_activity_stats(test_client):
    """
    Test the filteredActivityStats query in the GraphQL server.
    """
    filter_user_stats = """
    query filteredActivityStats($name: String, $activity: String)  {
        filteredActivityStats(name: $name, activity: $activity) {
        success
        errors
        results {
            longestDistance 
            longestDuration 
            fastestPace 
            totalDistance 
            totalDuration 
            totalActivities 
            }
        }
    }
    """
    variables = {'name': 'test_user', 'activity': 'running'}
    response = test_client.post('/api/graphql', json={'query': filter_user_stats, 'variables':  variables})
    filteredStats = json_util.loads(response.data)['data']['filteredActivityStats']
    results = filteredStats['results'][0]

    assert response.status_code == 200
    assert filteredStats['success'] == True
    assert results['longestDistance'] == 6.0
    assert results['longestDuration'] == 30
    assert results['fastestPace'] == 4.2
    assert results['totalDistance'] == 16.2
    assert results['totalDuration'] == 80.0
    assert results['totalActivities'] == 3
    
def test_graphql_weekly_user_stats(test_client):
    """
    Test the weeklyStats query in the GraphQL server.
    """
    weekly_stats_query = """
    query WeeklyStats($name: String, $start_date: String, $end_date: String)  {
        weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
        success
        errors
        results {
            username 
            totalCount
            totalDuration
            totalDistance
            exerciseCount {
                date
                count
                }
            }   
        }
    }
    """
    variables = {'name': 'test_user', 'start_date': '01-01-2022', 'end_date': '07-01-2022'}
    response = test_client.post('/api/graphql', json={'query': weekly_stats_query, 'variables': variables})
    weeklyStats = json_util.loads(response.data)['data']['weeklyStats']
    results = weeklyStats['results'][0]
    
    assert response.status_code == 200
    assert weeklyStats["success"] == True
    assert type(results) == dict
    assert results["totalCount"] == 3
    assert results["totalDistance"] == 16.0
    assert results["totalDuration"] == 70.0

    exerciseCount = results["exerciseCount"]
    sunday = [item for item in exerciseCount if item["date"] == '7']
    assert sunday[0]["count"] == 2
