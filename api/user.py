from flask import Blueprint, request, session

from decorators import api_wrapper, WebException
from utils import users

blueprint = Blueprint("user", __name__)

@blueprint.route("/register", methods=["POST"])
@api_wrapper
def register_user():
    """ Route for registering a user """
    form = request.form
    email = form.get("email")
    password = form.get("password")

    exists = users.get_user(email=email)
    if exists:
        raise WebException("Email already in use")

    users.create_user(email, password)

    return { "success": 1, "message": "Account created" }

@blueprint.route("/login", methods=["POST"])
@api_wrapper
def login_user():
    """ Route for logging in a user """
    form = request.form
    email = form.get("email")
    password = form.get("password")

    if not users.authenticate(email, password):
        raise WebException("Invalid credentials")

    session["email"] = email

    return { "success": 1, "message": "Success!" }
