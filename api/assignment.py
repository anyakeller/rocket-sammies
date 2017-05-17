from flask import Blueprint, request

from decorators import WebException, api_wrapper, login_required, teachers_only
from utils import assignments

blueprint = Blueprint("assignment", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_assignment():
    """ Route for creating an assignment """

    form = request.form
    cid = form.get("cid")
    title = form.get("title")
    description = form.get("description")
    max_score = form.get("max_score")
    _type = form.get("type")

    try:
        # Validate max_score
        max_score = int(max_score)
        assert max_score > 0
    except:
        raise WebException("Max score must be greater than 0")

    if _type == assignments.PROJECT:
        # Create a project assignment
        rubric = {} # TODO: Implement

        try:
            # Validate max_group_size
            max_group_size = int(form.get("max_group_size"))
            assert max_group_size > 1
        except:
            raise WebException("Maximum group size must be at least 2")

        assignments.create_project(cid, title, description, max_score, max_group_size, rubric)
    else:
        assignments.create_assignment(cid, title, description, max_score, _type)

    return { "success": 1, "message": "Assignment created" }

@blueprint.route("/submit", methods=["POST"])
@api_wrapper
@login_required
def submit_assignment():
    """ Route for submitting an assignment """
    # TODO: Implement
    return { "success": 1, "message": "Assignment submitted" }
