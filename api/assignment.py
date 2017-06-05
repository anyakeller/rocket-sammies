from flask import Blueprint, request

from decorators import WebException, api_wrapper, login_required, teachers_only
from utils import assignments, students

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

@blueprint.route("/submit", methods=["POST"])
@api_wrapper
@login_required
def submit_assignment():
    """Route for submitting an assignment"""
    # TODO: Implement
    return { "success": 1, "message": "Assignment submitted" }

@blueprint.route("/<aid>", methods=["GET"])
@api_wrapper
@login_required
def get_assignment_data(aid):
    """Route for getting the data describing an assignment"""
    matches = assignments.get_assignments(aid=aid)
    if len(matches) < 1:
        raise WebException("Assignment does not exist")
    return { "success": 1, "data": matches[0] }

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

@blueprint.route("/<aid>/newgroup", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def add_group_to_assignment(aid):
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
    groups = assignment["groups"]
    group = [str(sid) for sid in form.get("group")]

    if len(group) == 0:
        raise WebException("Group must contain at least one member")

    if len(group) > assignment["max_group_size"]:
        raise WebException("Maximum grop size exceeded")

    if group in groups:
        raise WebException("Group already exists")

    # Prevent members who are already in groups from being added to new ones
    overlap_ids = []
    for group2 in groups:
        for sid in group:
            if sid in group2:
                overlap_ids.append(sid)
    overlap_names = [students.getStudent(**{"Student ID": student})[0]["Student Name"].split(", ")[1] for student in overlap_ids]

    if len(overlap_names) == 1:
        raise WebException("%s is already in a group!" % overlap_names[0])
    elif len(overlap_names) == 2:
        raise WebException("%s and %s are already in groups!" % (overlap_names[0], overlap_names[1]))
    elif len(overlap_names) > 1:
        strnames = ", ".join(overlap_names[:-1]) + ", and " + overlap_names[-1]
        raise WebException("%s are already in groups!" % strnames)

    groups.append(group)
    assignments.update_assignment(aid,  {"groups": groups})
    return { "success": 1, "message": "Group added", "groups": groups }

@blueprint.route("/<aid>/group-rm-member", methods=["POST"])
@api_wrapper
@teachers_only
@login_required
def group_remove_member(aid):
    form = request.get_json()
    matches = assignments.get_assignments(aid=aid)
    if len(matches) != 1:
        raise WebException("Assignment does not exist")
    assignment = matches[0]
    groups = assignment["groups"]
    selected_group = [str(sid) for sid in form.get("group")]
    i = 0
    while i < len(groups):
        if selected_group == groups[i]:
            try:
                groups[i].remove(form.get("sid"))
            except:
                raise WebException("No such student in that group")
        i += 1
    # Remove empty groups
    groups = filter(lambda g: len(g) > 0, groups)
    assignments.update_assignment(aid,  {"groups": groups})
    return { "success": 1, "message": "Group added", "groups": groups }
