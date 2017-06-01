from flask import Blueprint, request, session

import utils
from utils import classes
from decorators import WebException, api_wrapper, login_required, teachers_only

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
    classes.create_class(name, teacher, student_ids)
    return { "success": 1, "message": "Class created" }

@blueprint.route("/<cid>/students", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students(cid):
    """Route for retrieving a list of all students in a class by its class id (cid)"""
    _classes = classes.get_class(cid=cid)
    if len(_classes) != 1:
        student_ids = []
    else:
        student_ids = _classes[0]["students"]
    students = []
    for sid in student_ids:
        matches = utils.students.getStudent(**{"Student ID": str(sid)})
        students += matches
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
    return { "success": 1, "message": "Class deleted" }
