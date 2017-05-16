import common

def create_assignment(title, cid, description, max_score, _type, rubric={}):
    """
    Creates an assignment and inserts it into the database
    Returns the id of the new assignment
    """

    db = common.get_connection()
    aid = common.random_string()
    assignment = {
        "aid": aid,
        "title": title,
        "description": description,
        "max_score": max_score,
        "type": _type,
        "rubric": rubric,
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
