from flask import Blueprint, request, session

from utils import classes
from decorators import WebException, api_wrapper, login_required, teachers_only

blueprint = Blueprint("class", __name__)

@blueprint.route("/create/", methods=["POST"])
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

@blueprint.route("/students/<cid>/", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students(cid):
    """Route for retrieving a list of all students in a class by its class id (cid)"""
    _classes = classes.get_class(cid=cid)
    if len(_classes) != 1:
        students = []
    else:
        students = _classes["students"]
    return { "success": 1, "data": students }

@blueprint.route("/delete/", methods=["POST"])
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
