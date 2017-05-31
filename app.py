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
    return render_template("login.html")

# For testing frontend:
@app.route("/gradebook")
@redirect_if_not_logged_in
def gradebook():
    return render_template("gradebook.html")

@app.route("/dashboard")
@redirect_if_not_logged_in
def dashboard():
    data = []
    classes = utils.classes.get_class(teacher=session.get("uid"))
    for klass in classes:
        students = [utils.students.getStudent(**{"Student ID": str(id)})[0] for id in klass["students"]]
        klass["students"] = students
        data.append({
            "class": klass,
            "assignments": utils.assignments.get_assignments(**{"cid": klass["cid"]})
        })
    return render_template("dashboard.html", data=data)

@app.route("/class")
@app.route("/class/<cid>")
@redirect_if_not_logged_in
def classview(cid=None):
    if cid is None:
        # View all classes if no class id was passed into the url
        classes = utils.classes.get_class(teacher=session.get("uid"))
        return render_template("class.html", classes=classes)

    # Get the class associated with the class id in the url
    classes = utils.classes.get_class(cid=cid)
    if len(classes) != 1:
        # Class does not exist, so return a 404 error
        abort(404)
    klass = classes[0]

    # Get all students in the class
    students = [utils.students.getStudent(**{"Student ID": str(id)})[0] for id in klass["students"]]

    # Get all assignments for the class
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
    """Inject the session into the template. Used to determine login status"""
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
@app.route("/assigntodash",methods=['GET','POST'])
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
