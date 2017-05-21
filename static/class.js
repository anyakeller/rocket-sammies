(function () {
    "use strict";
    var btnNewClass = document.getElementById("btn-new-class");
    var modalNewClass = document.getElementById("modal-new-class");
    var inputNewClassName = document.getElementById("input-new-class-name");
    var btnImportStudents = document.getElementById("btn-import-students");
    var inputImportStudents = document.getElementById("input-import-students");
    var inputCreateClassStudents = document.getElementById("input-create-class-students");
    var btnCreateClass = document.getElementById("btn-create-class");
    var elemStudentList = document.getElementById("student-list");

    btnNewClass.addEventListener("click", function () {
        $(modalNewClass).modal();
    });

    btnCreateClass.addEventListener("click", function () {
        var name = inputNewClassName.value.trim();
        if (name === "") {
            $.notify("Please enter a class name");
        } else {
            PM.apiCall("POST", "/api/class/create", {
                "name": name
            }, "/class");
        }
    });

    var addStudent = function (student) {
        var checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("data-id", student["Student ID"]);
        checkbox.setAttribute("data-name", student["Student Name"]);
        var label = document.createElement("LABEL");
        label.appendChild(checkbox);
        label.innerHTML += student["Student Name"];
        var li = document.createElement("LI");
        li.appendChild(label);
        elemStudentList.appendChild(li);
    };

    btnImportStudents.addEventListener("change", function () {
        console.log("onload");
        var reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
            PM.apiCall("POST", "/api/students/add-csv", {
                "csv": reader.result
            }, function (response) {
                console.log(response);
                response.added_students.forEach(addStudent);
            });
        };
        reader.readAsText(btnImportStudents.files[0]);
        // When the file is loaded, it is read into a string and onload is called
    });

    PM.apiCall("GET", "/api/students", null, function (response) {
        response.data.forEach(addStudent);
    });
}());
