from flask import Flask, render_template
import os

import api

app = Flask(__name__)

# Register all api blueprints
app.register_blueprint(api.assignment.blueprint, url_prefix="/api/assignment")
app.register_blueprint(api.classes.blueprint, url_prefix="/api/class")
app.register_blueprint(api.user.blueprint, url_prefix="/api/user")

@app.route("/")
def index():
    return "Hello"

@app.route("/login")
def login():
    return render_template("login.html")

# For testing frontend:
@app.route("/guitest")
def guitest():
    return render_template("gradebook.html")

if __name__ == "__main__":

    # Create and store secret key if it doesn't already exist
    with open(".secret_key", "a+b") as f:
        secret_key = f.read()
        if not secret_key:
            # Secret key doesn't exist, so generate it
            secret_key = os.urandom(64)
            f.write(secret_key)
            f.flush()
        app.secret_key = secret_key

    app.debug = True
    app.run()
