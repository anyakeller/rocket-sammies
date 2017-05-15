from flask import Blueprint, request

from decorators import api_wrapper

blueprint = Blueprint("user", __name__)

@blueprint.route("/register", methods=["POST"])
@api_wrapper
def register_user():
    """ Route for registering a user """
    form = request.form
    email = form.get("email")
    password = form.get("password")

    # TODO: Implement

    return { "success": 1, "message": "Account created" }

@blueprint.route("/login", methods=["POST"])
@api_wrapper
def login_user():
    """ Route for logging in a user """
    form = request.form
    email = form.get("email")
    password = form.get("password")

    # TODO: Implement

    return { "success": 1, "message": "Success!" }
