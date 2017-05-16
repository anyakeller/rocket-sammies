import common

PROJECT = 0
HOMEWORK = 1

def create_assignment(cid, title, description, max_score, _type):
    """
    Creates a regular assignment and inserts it into the database
    Returns the id of the new assignment
    """

    db = common.get_connection()
    aid = common.random_string()
    assignment = {
        "aid": aid,
        "cid": cid,
        "title": title,
        "description": description,
        "max_score": max_score,
        "type": _type
    }

    db.assignments.insert(assignment)
    return aid

def create_project(cid, title, description, max_score, max_group_size, rubric):
    """
    Creates a project assignment and inserts it into the database
    Returns the id of the new assignment
    """

    db = common.get_connection()
    aid = common.random_string()
    assignment = {
        "aid": aid,
        "cid": cid,
        "title": title,
        "description": description,
        "max_score": max_score,
        "type": PROJECT,
        "rubric": rubric,
        "max_group_size": max_group_size,
        "groups": [],
    }

    db.assignments.insert(assignment)
    return aid

def get_assignment(aid):
    """
    Retrieve an assignment from its assignment id (aid)
    Returns None if the assignment does not exist
    """

    db = common.get_connection()
    match = {
        "aid": aid
    }
    assignment = db.assignments.find_one(match)
    return assignment

def remove_assignment(aid):
    """
    Remove an assignment with a specific id
    Returns the number of deleted documents
    """

    db = common.get_connection()
    match = {
        "aid": aid
    }
    result = db.assignments.delete_one(match)
    return result.deleted_count
