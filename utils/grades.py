import common

def create_grade(aid, sid, grades):
    """
    Creates a student's grade for an assignment and inserts it into the database
    Returns the id of the new grade
    """
    db = common.get_connection()

    gid = common.random_string()
    grade = {
        "gid": gid,
        "aid": aid,
        "sid": sid, # Student id
        "grades": grades
    }
    db.grades.insert(grade)
    return gid

def get_grade(**keyword):
    """Retrieves all grades that match the keyword arguments"""
    db = common.get_connection()
    foundGrades = db.grades.find(keyword)
    return list(foundGrades)

def update_grade(gid, data):
    """Update a grade with a specific id"""
    db = common.get_connection()
    result = db.grades.update_one({"gid": gid}, {"$set": data})
    return result.matched_count

def remove_grade(**match):
    """Removes a grade from the database"""
    db = common.get_connection()
    result = db.grades.delete_many(match)
    return result.deleted_count
