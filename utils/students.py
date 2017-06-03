import csv
import common

# CSV Schema:
# Student ID,Student Name,Grade,Student Email,Student Phone,Surname,Contact Type,Contact Name,Relationship,Resides In HH,Correspondence,Custodial Parent,Has Alert,Contact Priority,Contact Address,Contact Email,Home Phone,Cell Phone,Work Phone,Portal ID

db = common.get_connection()

# Adds single student from CSV file to database
def addStudent(studentFile):
    student = {}
    with open(studentFile) as csvFile:
        reader = csv.DictReader(csvFile)
        student = reader.next()
    db.students.insert(student)

# Adds mulitple students from CSV file to database
def addStudents(studentFile):
    students = []
    with open(studentFile) as csvFile:
        reader = csv.DictReader(csvFile)
        for student in reader:
            students.append(student)
    db.students.insert_many(students)

# Adds mulitple students from CSV string
def addStudentsStr(studentsCSV):
    students = []
    reader = csv.DictReader(studentsCSV.split('\n'), delimiter=',')
    for student in reader:
        # Insert students into the database if they don't already exist
        result = db.students.update_one({"Student ID": student["Student ID"]}, {"$set": student}, upsert=True)
        if result.upserted_id != None:
            # New document was upserted (read: inserted) into the database
            students.append(student)
    return students

# Returns students based on keyword
def getStudent(**keyword):
    foundStudents = db.students.find(keyword)
    return list(foundStudents)

# Removes student based on email
def removeStudent(studentEmail):
    doomedStudent = {
        'Student Email': studentEmail
    }

    db.students.delete_one(doomedStudent)

if __name__ == '__main__':
    addStudents('data/sample.csv')
