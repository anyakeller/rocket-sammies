from bson import json_util
from flask import make_response, redirect, session
from functools import wraps

import json
import traceback

response_header = {"Content-Type": "application/json charset=utf-8"}

class WebException(Exception):
    """
    Exception raised by the api to indicate a failed request

    Example:
    >>> raise WebException("invalid credentials")
    """
    pass

def api_wrapper(f):
    """ Decorator used to return a json response from an api endpoint """
    @wraps(f)
    def wrapper(*args, **kwargs):
        result = {}
        response = 200
        try:
            result = f(*args, **kwargs)
        except WebException as e:
            # An Exception was raised intentionally to indicate failure
            result = { "success": 0, "message": str(e) }
        except Exception:
            # Unexpected Exception, so ensure that something is returned
            traceback.print_exc() # Print traceback for debugging
            result = { "success": 0, "message": "Something went wrong!" }
        result = (json.dumps(result, default=json_util.default), response, response_header)
        return make_response(result)
    return wrapper

def login_required(f):
    """ Decorator used to block requests from users that are not logged in """
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "uid" not in session:
            raise WebException("You must be logged in to do that.")
        return f(*args, **kwargs)
    return wrapper

def teachers_only(f):
    """ Decorator used to block requests from non-teacher users """
    @wraps(f)
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper

def redirect_if_not_logged_in(f):
    """ Decorator to redirect users if they are not logged in """
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "uid" not in session:
            return redirect("/login")
        return f(*args, **kwargs)
    return wrapper
