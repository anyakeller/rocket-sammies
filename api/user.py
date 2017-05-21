from flask import Blueprint, request, session

from decorators import api_wrapper, teachers_only, login_required, WebException
from utils import classes, users

import hashlib

blueprint = Blueprint("user", __name__)

@blueprint.route("/register", methods=["POST"])
@api_wrapper
def register_user():
    """Route for registering a user"""
    form = request.form
    email = form.get("email")
    password = form.get("password")

    exists = users.get_user(email=email)
    if exists:
        raise WebException("Email already in use")

    uid = users.create_user(email, password)
    session["uid"] = uid

    return { "success": 1, "message": "Account created" }

@blueprint.route("/login", methods=["POST"])
@api_wrapper
def login_user():
    """Route for logging in a user"""
    form = request.form
    email = form.get("email")
    password = hashlib.sha256(form.get("password")).hexdigest()

    user = users.get_user(email=email, password=password)
    if user is None:
        raise WebException("Invalid credentials")

    session["uid"] = user["uid"]

    return { "success": 1, "message": "Success!" }

@blueprint.route("/classes", methods=["GET"])
@api_wrapper
@teachers_only
@login_required
def get_classes():
    """Route for retrieving all classes owned by a teacher"""
    tid = session.get("uid")
    data = classes.get_classes(teacher=tid)

    return { "success": 1, "data": data }
