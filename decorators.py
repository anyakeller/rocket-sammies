from flask import make_response, redirect, session
from functools import wraps

import json
import traceback

response_header = {"Content-Type": "application/json charset=utf-8"}

def api_wrapper(f):
    """
    Decorator used to return a json response from an api endpoint
    Suggested use:
        Return {"success": 1, "message": <message>} for successful requests
        Return {"success": 0, "message": <error>} for bad requests
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        result = {}
        response = 200
        try:
            result = f(*args, **kwargs)
        except Exception:
            # Print traceback for debugging
            traceback.print_exc()
            # Ensure that something is returned, even if the server crashes
            result = {"success": 0, "message": "Something went wrong!"}
        result = (json.dumps(result), response, response_header)
        return make_response(result)
    return wrapper

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "email" not in session:
            return redirect("/login")
        return f(*args, **kwargs)
    return wrapper

def teachers_only(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper
