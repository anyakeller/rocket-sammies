from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello"

@app.route("/login")
def login():
    return render_template("login.html")

if __name__ == "__main__":

    # Create and store secret key if it doesn't already exist
    with open(".secret_key", "a+b") as f:
        secret_key = f.read()
        if not secret_key:
            secret_key = os.urandom(64)
            f.write(secret_key)
            f.flush()
        app.secret_key = secret_key

    app.debug = True
    app.run()
