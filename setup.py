import utils

db = utils.common.get_connection()

collections = ["assignments", "classes", "grades", "students", "users"]

for collection in collections:
    db.drop_collection(collection)
