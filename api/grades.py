from flask import Blueprint, request

from decorators import WebException, api_wrapper, login_required, teachers_only
from utils import grades

blueprint = Blueprint("grades", __name__)

#@blueprint.route("/create", methods=["POST"])
#@api_wrapper
#@teachers_only
#@login_required
#def create_grade():
#    form = request.get_json()
#    sid = form.get("sid")
#    aid = form.get("aid")
#    scores = form.get("grades", [])
#
#    grades.create_grade(aid, sid, scores)
#    return { "success": 1, "message": "Grade added" }

@blueprint.route("/update", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def update_grade():
    form = request.get_json()
    aid = form["aid"]
    sid = form["sid"]
    num_matched = grades.update_grade(sid, aid, form)
    return { "success": 1, "message": "Grade updated" }
