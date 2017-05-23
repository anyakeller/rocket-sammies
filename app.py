from flask import Flask, abort, render_template, session, redirect
import os


import api
from decorators import redirect_if_not_logged_in
import utils

app = Flask(__name__)

# Register all api blueprints
app.register_blueprint(api.assignment.blueprint, url_prefix="/api/assignment")
app.register_blueprint(api.classes.blueprint, url_prefix="/api/class")
app.register_blueprint(api.user.blueprint, url_prefix="/api/user")
app.register_blueprint(api.students.blueprint, url_prefix="/api/students")

@app.route("/")
@redirect_if_not_logged_in
def index():
    return redirect("/dashboard")

@app.route("/login")
def login():
    print session
    return render_template("login.html")

# For testing frontend:
@app.route("/gradebook")
@redirect_if_not_logged_in
def gradebook():
    return render_template("gradebook.html")

@app.route("/dashboard")
@redirect_if_not_logged_in
def dashboard():
    return render_template("dashboard.html")

@app.route("/class")
@app.route("/class/<cid>")
@redirect_if_not_logged_in
def classview(cid=None):
    if cid is None:
        classes = utils.classes.get_class(teacher=session.get("uid"))
        return render_template("class.html", classes=classes)
    classes = utils.classes.get_class(cid=cid)
    if len(classes) != 1:
        abort(404)
    klass = classes[0]
    students = [utils.students.getStudent(**{"Student ID": id})[0] for id in klass["students"]]
    assigs = utils.assignments.get_assignments(cid=cid)
    return render_template("oneclass.html",
        klass=klass,
        students=students,
        assignments=assigs)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.context_processor
def inject_session():
    if session:
        return dict(session)
    return {}

@app.route("/oneclass")
def oneclass():
    return render_template("oneclass.html")

@app.route("/assignment")
def assignment():
    return render_template("assignment.html")

@app.route("/createAssignment", methods = ['POST'])
def newAssignment():
    return redirect('assignment')
@app.route("/assigntodash",methods=['POST'])
def backtodash():
    return redirect('dashboard')

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

