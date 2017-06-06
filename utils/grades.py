import common

def get_grade(**keyword):
    """Retrieves all grades that match the keyword arguments"""
    db = common.get_connection()
    foundGrades = db.grades.find(keyword)
    return list(foundGrades)

def update_grade(sid, aid, data):
    """Update a grade given an sid and aid, or insert the grade if not found"""
    db = common.get_connection()
    result = db.grades.update_one({"sid": sid, "aid": aid}, {"$set": data}, True)
    print get_grade()
    return result.matched_count

def remove_grade(**match):
    """Removes a grade from the database"""
    db = common.get_connection()
    result = db.grades.delete_many(match)
    return result.deleted_count
