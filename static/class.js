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

    btnCreateClass.addEventListener("click", function () {
        var name = inputNewClassName.value.trim();
        if (name === "") {
            $.notify("Please enter a class name");
        } else {
            PM.apiCall("POST", "/api/class/create", {
                "name": name,
                "students": studentSelector.getSelectedStudentIDs()
            }, "/class");
        }
    });

    btnImportStudents.addEventListener("change", function () {
        var reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
            PM.apiCall("POST", "/api/students/add-csv", {
                "csv": reader.result
            }, function (response) {
                console.log(response);
                response.added_students.forEach(function (studentData) {
                    studentSelector.addStudent(studentData);
                });
            });
        };
        reader.readAsText(btnImportStudents.files[0]);
        // When the file is loaded, it is read into a string and onload is called
    });

    PM.apiCall("GET", "/api/students", null, function (response) {
        response.data.forEach(function (studentData) {
            studentSelector.addStudent(studentData);
        });
    });
}());
