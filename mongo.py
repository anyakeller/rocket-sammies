from pymongo import MongoClient

client = MongoClient()
db = client['projectManager']

#Adds new user upon registration
def newUser():
    user = {"email": "user@example.com",
        "name": "John Doe",
        "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        "type": "student",
        "classes": {
            123456: {
                "hw1-123456": 100
            }
        }}

    db.
