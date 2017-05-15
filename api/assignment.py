from flask import Blueprint

from decorators import api_wrapper

blueprint = Blueprint("assignment", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
def create_assignment():
    # TODO: Implement
    return { "success": 1, "message": "Assignment created" }

@blueprint.route("/submit", methods=["POST"])
@api_wrapper
def submit_assignment():
    # TODO: Implement
    return { "success": 1, "message": "Assignment submitted" }
