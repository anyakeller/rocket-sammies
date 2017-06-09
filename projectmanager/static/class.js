(function () {
    "use strict";
    var btnNewClass = document.getElementById("btn-new-class");
    var modalNewClass = document.getElementById("modal-new-class");
    var inputNewClassName = document.getElementById("input-new-class-name");
    var btnImportStudents = document.getElementById("btn-import-students");
    var inputImportStudents = document.getElementById("input-import-students");
    var inputCreateClassStudents = document.getElementById("input-create-class-students");
    var btnCreateClass = document.getElementById("btn-create-class");

    btnNewClass.addEventListener("click", function () {
        $(modalNewClass).modal();
    });

    var studentSelector = PM.studentSelector(document.getElementById("student-selection"));
    studentSelector.loadFromServer();

    var creatingClass = false;
    btnCreateClass.addEventListener("click", function () {
        // If an apiCall is in progress, cancel
        if (creatingClass) {
            $.notify("Action is in progress");
            return;
        }
        var name = inputNewClassName.value.trim();
        if (name === "") {
            $.notify("Please enter a class name");
        } else {
            creatingClass = true;
            PM.apiCall("POST", "/api/class/create", {
                "name": name,
                "students": studentSelector.getSelectedStudentIDs()
            }, function (response) {
                window.location = "/class/" + response.data.cid;
            }, function () {
                creatingClass = false;
            });
        }
    });

    btnImportStudents.addEventListener("change", function () {
        var reader = new FileReader();
        reader.onload = function () {
            PM.apiCall("POST", "/api/students/add-csv", {
                "csv": reader.result
            }, function (response) {
                response.added_students.forEach(function (studentData) {
                    studentSelector.addStudent(studentData);
                });
            });
        };
        reader.readAsText(btnImportStudents.files[0]);
        // When the file is loaded, it is read into a string and onload is called
    });

    var deleteClassBtns = document.getElementsByClassName("delete-class"), i;
    var rmClass = function (cid) {
        PM.apiCall("POST", "/api/class/delete", {
            cid: cid
        }, function () {
            var panel = document.getElementById("panel-" + cid);
            panel.remove();
        });
    };
    var deleteClassHandler = function (cid) {
        return function (event) {
            // TODO: use a modal rather than a confirm
            if (confirm("Are you sure you want to delete this class?")) {
                rmClass(cid);
            }
        };
    };
    var cid;
    for (i = 0; i < deleteClassBtns.length; i++) {
        cid = deleteClassBtns[i].getAttribute("data-cid");
        deleteClassBtns[i].addEventListener("click", deleteClassHandler(cid));
    }
}());
