from flask import Blueprint, request

from projectmanager.decorators import WebException, api_wrapper, login_required, teachers_only
from projectmanager.utils import assignments, groups, students

blueprint = Blueprint("assignment", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def create_assignment():
    """Route for creating an assignment"""
    form = request.get_json()
    cid = form.get("cid")
    title = form.get("title")
    description = form.get("description")
    max_score = form.get("max_score")
    _type = form.get("type", "Regular Assignment")
    rubric = form.get("rubric", [])

    try:
        # Validate max_score
        max_score = int(max_score)
        assert max_score > 0
    except:
        raise WebException("Max score must be greater than 0")

    if _type == "Group Project":

        try:
            # Validate max_group_size
            max_group_size = int(form.get("max_group_size"))
            assert max_group_size > 1
        except:
            raise WebException("Maximum group size must be at least 2")

        assignments.create_project(cid, title, description, max_score, rubric, max_group_size)
    else:
        assignments.create_assignment(cid, title, description, max_score, _type, rubric)

    return { "success": 1, "message": "Assignment created" }

@blueprint.route("/<aid>", methods=["GET"])
@api_wrapper
@login_required
def get_assignment_data(aid):
    """Route for getting the data describing an assignment"""
    matches = assignments.get_assignments(aid=aid)
    if len(matches) < 1:
        raise WebException("Assignment does not exist")
    assignment = matches[0]
    assignment["groups"] = [groups.get_group(gid=gid)[0] for gid in assignment.get("groups", [])]
    return { "success": 1, "data": assignment }

@blueprint.route("/<aid>/update", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def update_assignment(aid):
    form = request.get_json()
    num_matched = assignments.update_assignment(aid, form)
    if num_matched == 0:
        raise WebException("Assignment does not exist")
    return { "success": 1, "message": "Assignment updated" }

@blueprint.route("/<aid>/delete")
@api_wrapper
@teachers_only
@login_required
def delete_assignment(aid):
    deleted_count = assignments.remove_assignment(aid=aid)
    if deleted_count < 1:
        raise WebException("Assignment does not exist")
    return { "success": 1, "message": "Assignment deleted" }

@blueprint.route("/<aid>/assign", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def assign_assignment(aid):
    form = request.get_json()
    assign = form.get("assign", False)
    num_matched = assignments.update_assignment(aid, {"assigned": assign})
    if num_matched == 0:
        raise WebException("Assignment does not exist")
    return { "success": 1, "assigned": assign }

@blueprint.route("/<aid>/add-group", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def add_group(aid):
    form = request.get_json()
    matches = assignments.get_assignments(aid=aid)
    if len(matches) != 1:
        raise WebException("Assignment does not exist")
    assignment = matches[0]
    assign_groups = assignment["groups"]
    new_group = [str(sid) for sid in form.get("group")]
    overlap_ids = []
    for student in new_group:
        if groups.in_group(aid, student):
            overlap_ids.append(student)

    if len(overlap_ids) > 0:
        overlap_names = [students.getStudent(**{"Student ID": student})[0]["Student Name"].split(", ")[1] for student in overlap_ids]
        if len(overlap_names) == 1:
                raise WebException("%s is already in a group!" % overlap_names[0])
        elif len(overlap_names) == 2:
            raise WebException("%s and %s are already in groups!" % (overlap_names[0], overlap_names[1]))
        elif len(overlap_names) > 1:
            strnames = ", ".join(overlap_names[:-1]) + ", and " + overlap_names[-1]
            raise WebException("%s are already in groups!" % strnames)

    gid = groups.create_group(aid, new_group)
    assign_groups.append(gid)

    assignments.update_assignment(aid,  {"groups": assign_groups})
    return { "success": 1, "message": "Group added", "groups": assign_groups }

@blueprint.route("/<aid>/group-rm-member", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def group_remove_member(aid):
    form = request.get_json()
    # matches = assignments.get_assignments(aid=aid)
    # if len(matches) != 1:
    #     raise WebException("Assignment does not exist")
    # assignment = matches[0]
    groups.remove_member(form["gid"], form["sid"])
    return { "success": 1, "message": "Group member removed" }
