from flask import Blueprint, request

from utils import students
from decorators import api_wrapper, login_required, teachers_only

blueprint = Blueprint("students", __name__)

@blueprint.route("/", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_students():
    """Get all students in the database"""
    data = students.getStudent()
    return { "success": 1, "data": data }

@blueprint.route("/add-csv/", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def add_students():
    """Add students to the database"""
    # FIXME: check for duplicates (e.g. for when the user accidentally
    # re-uploads same file)
    # FIXME: handle invalid CSV
    form = request.get_json()
    s = students.addStudentsStr(form["csv"])
    return { "success": 1, "added_students": s }
