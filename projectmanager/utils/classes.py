import common

from projectmanager.utils import students

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

def get_students(cid):
    _classes = get_class(cid=cid)
    if len(_classes) != 1:
        student_ids = []
    else:
        student_ids = _classes[0]["students"]
    all_students = []
    for sid in student_ids:
        matches = students.getStudent(**{"Student ID": str(sid)})
        all_students += matches
    return all_students
