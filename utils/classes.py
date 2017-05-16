import common

def create_class(name, tid, students=[]):
    """
    Creates a class and inserts it into the database
    Returns the cid of the new class
    """
    db = common.get_connection()
    cid = common.random_string()
    class_ = {
        "cid": cid,
        "name": name,
        "students": students,
        "teacher": tid,
        "assignments": [],
        "weightmap": {},
    }

    db.classes.insert(class_)
    return cid

def get_class(cid):
    """
    Retrieve a class from its class id (cid)
    Returns None if the class does not exist
    """

    db = common.get_connection()
    match = {
        "cid": cid
    }
    class_ = db.classes.find_one(match)

    return class_

def get_classes():
    """Retrieve a list of all classes"""

    db = common.get_connection()
    classes = db.classes.find()

    return list(classes)

def remove_class(cid):
    """
    Delete a class from its class id
    Returns the number of deleted documents
    """

    db = common.get_connection()
    match = {
        "cid": cid
    }
    result = db.classes.delete_one(match)
    return result.deleted_count
