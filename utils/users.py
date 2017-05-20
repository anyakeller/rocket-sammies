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

def get_user(**match):
    """Retrieve a single user based on the keyword arguments provided"""

    db = common.get_connection()
    user = db.users.find_one(match)

    return user
