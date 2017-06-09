from flask import Blueprint, request

from projectmanager.decorators import WebException, api_wrapper, login_required, teachers_only
from projectmanager.utils import grades

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

@blueprint.route("/get", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_grades():
    form = request.get_json()
    aid = form.get("aid")
    sid = form.get("sid")
    if aid == None and sid == None:
        data = grades.get_grade()
    elif sid == None:
        data = grades.get_grade(aid=aid)
    elif aid == None:
        data = grades.get_grade(sid=sid)
    else:
        data = grades.get_grade(aid=aid, sid=sid)
    return { "success": 1, "data": data }
