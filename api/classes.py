from flask import Blueprint, request

from utils import classes
from decorators import WebException, api_wrapper, login_required, teachers_only

blueprint = Blueprint("class", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_class():
    """ Route for creating a class """
    form = request.form
    name = form.get("name")
    teacher = 1 # users.get_user(session.get("email")).uid
    classes.create_class(name, teacher)
    return { "success": 1, "message": "Class created" }

@blueprint.route("/students/<cid>", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students(cid):
    """ Route for retrieving a list of all students in a class by its class id (cid) """
    _class = classes.get_class(cid)
    if _class is None:
        students = []
    else:
        students = _class["students"]
    return { "success": 1, "data": students }

@blueprint.route("/delete", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def delete_class():
    """ Route for deleting a class """
    form = request.form
    cid = form.get("cid")
    count = classes.remove_class(cid)
    if count == 0:
        raise WebException("Class does not exist")
    return { "success": 1, "message": "Class deleted" }
