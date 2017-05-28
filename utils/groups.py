import common

db = common.get_connection()

# Takes in assignment ID and list of student's emails and adds them to the assignment
def addGroup(aid, studentList):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    gid = common.random_string()
    groups[gid] = studentList
    db.assignments.update_one({'aid': aid}, {'groups': groups})
    return gid

# Takes in assignment ID and list of groups and adds them to the assignment
def addGroups(aid, groupList):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    for group in groupList:
        gid = common.random_string()
        groups[gid] = group
    return db.assignments.update_many({'aid': aid}, {'groups': groups})

def removeGroup(aid, gid):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    groups.pop(gid)
    return db.assignments.update_one({'aid': aid}, {'groups': groups})

def addMember(aid, studentEmail):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']

def removeMember(aid, studentEmail):
    assignment = db.assignments.find({'aid': aid})
    groups = assignment['groups']
    for group in groups:
        try:
            group.remove(studentEmail)
        except ValueError:
            pass
    return db.assignments.update_one({'aid': aid}, {'groups': groups})