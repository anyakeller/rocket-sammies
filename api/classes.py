from flask import Blueprint

from decorators import api_wrapper, login_required, teachers_only

blueprint = Blueprint("class", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_class():
    """ Route for creating a class """
    # TODO: Implement
    return { "success": 1, "message": "Class created" }

@blueprint.route("/students/<int:cid>", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students(cid):
    """ Route for retrieving a list of all students in a class by its class id (cid) """
    students = []
    # TODO: Implement
    return { "success": 1, "data": students }
