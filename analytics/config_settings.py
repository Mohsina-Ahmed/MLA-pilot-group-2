import os
from dotenv import load_dotenv

load_dotenv()

# base configuration 
class Config(object):
    MONGO_URI = os.getenv('MONGO_URI')
    MONGO_DB = os.getenv('MONGO_DB')

# test configuration 
class TestConfig(Config):
    TESTING = True
    DEBUG = True
    MONGO_DB = 'test_database'