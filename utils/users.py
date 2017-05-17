import common

def create_user(email, password):
    """
    Creates a user and inserts it into the database
    Returns the id of the new user
    """
    # TODO: Implement type? (student vs teacher)

    db = common.get_connection()
    uid = common.random_string()
    user = {
        "uid": uid,
        "email": email,
        "password": common.hash(password)
    }

    db.users.insert(user)
    return uid

def authenticate(email, password):
    """ Authenticates a user """

    db = common.get_connection()
    match = {
        "email": email,
        "password": common.hash(password),
    }

    user = db.users.find_one(match)
    return user is not None

def get_user(uid=None, email=None):
    """Retrieve a user from their uid or email"""

    db = common.get_connection()
    match = {}

    if uid:
        match["uid"] = uid
    if email:
        match["email"] = email

    user = db.users.find_one(match)

    return user
