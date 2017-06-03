import common

def create_assignment(cid, title, description, max_score, _type, rubric):
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
        "rubric": rubric,
        "type": _type,
        "assigned": False,
    }

    db.assignments.insert(assignment)
    return aid

def create_project(cid, title, description, max_score, rubric, max_group_size):
    """
    Creates a group project assignment and inserts it into the database
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
        "rubric": rubric,
        "type": "Group Project",
        "max_group_size": max_group_size,
        "groups": [],
        "active": False,
    }

    db.assignments.insert(assignment)
    return aid

def get_assignments(**match):
    """Retrieve all assignments that match the keyword arguments provided"""

    db = common.get_connection()
    assignments = db.assignments.find(match)
    return list(assignments)

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

def update_assignment(aid, data):
    """
    Update an assignment with a specific id
    """

    db = common.get_connection()
    result = db.assignments.update_one({"aid": aid}, data)
    return result.modified_count
