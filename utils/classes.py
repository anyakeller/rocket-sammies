import common

def create_class(name, tid, students=[]):
    """
    Creates a class and inserts it into the database
    Returns the id of the new class
    """
    db = common.get_connection()
    cid = common.random_string()
    class_ = {
        "cid": cid,
        "name": name,
        # students contains OSISes (values of "Student ID" in the student
        # collection)
        "students": students,
        "teacher": tid,
        "assignments": {"work": [], "projects": []},
        "weightmap": {},
    }

    db.classes.insert(class_)
    return cid

def get_class(**match):
    """Retrieve all classes that match the keyword arguments """

    db = common.get_connection()
    classes = db.classes.find(match)

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
