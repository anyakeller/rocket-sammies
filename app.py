from flask import Flask, abort, render_template, session, redirect, request, Response
import os

import api
from decorators import redirect_if_not_logged_in
import utils

app = Flask(__name__)

# Register all api blueprints
app.register_blueprint(api.assignment.blueprint, url_prefix="/api/assignment")
app.register_blueprint(api.classes.blueprint, url_prefix="/api/class")
app.register_blueprint(api.grades.blueprint, url_prefix="/api/grade")
app.register_blueprint(api.user.blueprint, url_prefix="/api/user")
app.register_blueprint(api.students.blueprint, url_prefix="/api/students")

@app.route("/")
@redirect_if_not_logged_in
def index():
    return redirect("/dashboard")

@app.route("/login/")
def login():
    return render_template("login.html")

@app.route("/dashboard/")
@redirect_if_not_logged_in
def dashboard():
    data = []
    classes = utils.classes.get_class(teacher=session.get("uid"))
    for klass in classes:
        students = [utils.students.getStudent(**{"Student ID": str(id)})[0] for id in klass["students"]]
        klass["students"] = students
        klass["assignments"] = utils.assignments.get_assignments(**{"cid": klass["cid"]})
        data.append(klass)
    return render_template("dashboard.html", classes=data)

@app.route("/assignment/<aid>/")
@redirect_if_not_logged_in
def view_assignment(aid):
    matches = utils.assignments.get_assignments(aid=aid)
    if len(matches) == 0:
        # Assignment does not exist
        abort(404)
    assignment = matches[0]
    # Make a map from student ID to student data
    students = utils.classes.get_students(assignment["cid"])
    students_by_id = {}
    for s in students:
        students_by_id[s["Student ID"]] = s
    return render_template("edit_assignment.html", assignment=assignment, students_by_id=students_by_id)

@app.route("/assignment/<aid>/gradepage")
def gradepage():
    print "CAVSCAVSCAVSCAVS"
    return render_template("gradepage.html")


@app.route("/class/")
@app.route("/class/<cid>/")
@redirect_if_not_logged_in
def classview(cid=None):
    if cid is None:
        # View all classes if no class id was passed into the url
        classes = utils.classes.get_class(teacher=session.get("uid"))
        return render_template("class.html", classes=classes)

    # Get the class associated with the class id in the url
    classes = utils.classes.get_class(cid=cid)
    if len(classes) == 0:
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

@app.route("/class/<cid>/gradebook")
def singleClassGradeBook(cid):
    klass = utils.classes.get_class(cid=cid)[0]
    students = [utils.students.getStudent(**{"Student ID": str(id)})[0] for id in klass["students"]]
    assignments = utils.assignments.get_assignments(cid=cid)
    return render_template("gradebook.html", klass=klass, students=students, assignments=assignments)

@app.route("/class/<cid>/export/")
def export_class(cid):
    klass = utils.classes.get_class(cid=cid)[0]
    students = klass.get("students", [])
    results = []
    for student in students:
        results.append(utils.students.getStudent(**{"Student ID":str(student)})[0])
    keys = results[0].keys()
    keys.remove("_id") # Remove Mongo object id
    csv = ",".join(keys)
    csv += "\n"
    for row in results:
        values = []
        for key in keys:
            if key in row:
                column = str(row[key])
                if "," in column:
                    # Quote column is a comma is present
                    column = "\"%s\"" % column
                values.append(column)
            else:
                values.append("")
        csv = csv + ",".join(values)+"\n"

    return Response(
            csv,
            mimetype="text/csv",
            headers={"Content-disposition":"attachment; filename=students.csv"})

@app.route("/logout/")
def logout():
    session.clear()
    return redirect("/")

@app.context_processor
def inject_session():
    """Inject the session into the template. Used to determine login status"""
    if session:
        return dict(session)
    return {}


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
