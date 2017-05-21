from flask import Blueprint

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