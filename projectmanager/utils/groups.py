import common


def create_group(aid, students):
    """
    Creates a group and inserts it into the database
    Returns the id of the new group
    """
    db = common.get_connection()
    gid = common.random_string()
    group = {
        "gid": gid,
        "aid": aid,
        "students": students,
    }
    db.groups.insert(group)

    return gid

def remove_group(gid):
    """
    Delete a group from its group id
    Returns the number of deleted documents
    """
    db = common.get_connection()
    match = {
        "gid": gid
    }
    result = db.groups.delete_one(match)
    return result.deleted_count

def get_group(**match):
    """Retrieve all groups that match the keyword arguments"""
    db = common.get_connection()
    groups = db.groups.find(match)
    return list(groups)

def in_group(aid, student):
    """Check if a student is already in a group"""
    db = common.get_connection()
    result = db.groups.find({"students": {"$in": [student]}, "aid": aid})
    return result.count() > 0

def add_member(gid, student):
    """Add a member from a group"""
    db = common.get_connection()
    result = db.groups.update({"gid": gid}, {"$push": {"students": student}})
    return result.u

def remove_member(gid, student):
    """Remove a member from a group"""
    db = common.get_connection()
    db.groups.update({"gid": gid}, {"$pull": {"students": student}})
