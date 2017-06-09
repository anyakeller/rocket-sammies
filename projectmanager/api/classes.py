from flask import Blueprint, request, session

from projectmanager.utils import assignments, classes
from projectmanager.decorators import WebException, api_wrapper, login_required, teachers_only

blueprint = Blueprint("class", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_class():
    """Route for creating a class"""
    form = request.get_json()
    name = form.get("name")
    teacher = session.get("uid")
    student_ids = form["students"]
    cid = classes.create_class(name, teacher, student_ids)
    return { "success": 1, "data": { "cid": cid }, "message": "Class created" }

@blueprint.route("/<cid>/students", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students(cid):
    """Route for retrieving a list of all students in a class by its class id (cid)"""
    # Each "student" returned is directly from the db collection, i.e. it is
    # a dictionary with the "Student ID", "Student Name", ... properties.
    students = classes.get_students(cid)
    return { "success": 1, "data": students }

@blueprint.route("/delete", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def delete_class():
    """Route for deleting a class"""
    form = request.get_json()
    cid = form.get("cid")
    count = classes.remove_class(cid)
    if count == 0:
        raise WebException("Class does not exist")
    assignments.remove_assignment(cid=cid)
    return { "success": 1, "message": "Class deleted" }
