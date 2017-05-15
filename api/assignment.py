from flask import Blueprint

from decorators import api_wrapper, login_required, teachers_only

blueprint = Blueprint("assignment", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_assignment():
    # TODO: Implement
    return { "success": 1, "message": "Assignment created" }

@blueprint.route("/submit", methods=["POST"])
@api_wrapper
@login_required
def submit_assignment():
    # TODO: Implement
    return { "success": 1, "message": "Assignment submitted" }
