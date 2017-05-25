import common

db = common.get_connection()

# Takes in assignment ID and list of student's emails and adds them to the assignment
def addGroup(aid, studentList):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    groups.append(studentList)
    return db.assignments.update_one({'aid': aid}, {'groups': groups})

# Takes in assignment ID and list of groups and adds them to the assignment
def addGroups(aid, groupList):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    for group in groupList:
        groups.append(group)
    return db.assignments.update_many({'aid': aid}, {'groups': groups})
