from pymongo import MongoClient

import hashlib
import random

DATABASE_NAME = "project_manager"
HOST = "127.0.0.1"
PORT = 27017

client = None
connection = None

def get_connection():
    """
    Get connection to the database
    Ensures that only one global connection exists per thread
    """
    global client, connection

    if connection is None:
        client = MongoClient(HOST, PORT)
        connection = client[DATABASE_NAME]

    return connection

def hash(s):
    """Hash the given string"""
    return hashlib.sha256(s).hexdigest()

def random_string(length=32):
    """Generate a random string of a specific length (default is 32)"""
    alphabet = "abcdef0123456789"
    return "".join(random.choice(alphabet) for x in range(length))
