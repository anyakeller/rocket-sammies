import common

db = common.get_connection()

#Takes aid, targetID (be it email or gid) and list of grades as per rubric
def addGrade(aid, targetId, grades):
    grade = {'aid': aid, 'targetId': targetId, 'grades': grades}
    grade[aid] = aid
    grade[targetId] = targetId
    grade[grades] = grades
    db.grades.insert(grade)

# Returns grades based on keyword
def getGrade(**keyword):
    foundGrades = db.grades.find(keyword)
    return list(foundGrades)

# Removes grade
def removeGrade(aid, targetId,):
    doomedGrade = {
        'aid': aid,
        'targetId': targetId
    }

    db.grades.delete_one(doomedGrade)
