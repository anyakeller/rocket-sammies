import os

import pymongo

import common

def secret_key():
    """Get the secret key from the database, or insert a random secret key, and return it"""
    db = common.get_connection()
    new_secret_key = os.urandom(64).encode('base-64')
    # The update docs (specifically with upsert=true) warn that the filter
    # should identify a document by a unique index to avoid multiple threads
    # from inserting duplicate documents.
    index = pymongo.IndexModel([("kid", pymongo.ASCENDING)])
    db.keys.create_indexes([index])

    # In the following:
    # - update_one({}, ...) updates the first document in the collection
    # - upsert=True makes the call insert ("upsert") a document if none is found
    # - $setOnInsert assigns to documents that were inserted, but not those that
    #   were found
    # The "kid" field serves as a unique index for the one document in this collection.
    result = db.keys.update_one({"kid": 0}, {
        "$setOnInsert": {
            "kid": 0,
            "key": new_secret_key
        }
    }, upsert=True)
    secret_key = db.keys.find_one()["key"]
    return secret_key

