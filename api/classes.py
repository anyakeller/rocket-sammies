from flask import Blueprint

from decorators import api_wrapper

blueprint = Blueprint("class", __name__)

@blueprint.route("/create", methods=["POST"])
@api_wrapper
def create_class():
    # TODO: Implement
    return { "success": 1, "message": "Class created" }
