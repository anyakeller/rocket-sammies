(function () {
    "use strict";
    var btnNewClass = document.getElementById("btn-new-class");
    var modalNewClass = document.getElementById("modal-new-class");
    var inputNewClassName = document.getElementById("input-new-class-name");
    var btnImportStudents = document.getElementById("btn-import-students");
    var inputImportStudents = document.getElementById("input-import-students");
    var inputCreateClassStudents = document.getElementById("input-create-class-students");
    var elemStudentList = document.getElementById("student-list");
    var btnToggleAllStudents = document.getElementById("btn-toggle-all-students");
    var btnCreateClass = document.getElementById("btn-create-class");

    btnNewClass.addEventListener("click", function () {
        $(modalNewClass).modal();
    });

    btnCreateClass.addEventListener("click", function () {
        var name = inputNewClassName.value.trim();
        if (name === "") {
            $.notify("Please enter a class name");
        } else {
            PM.apiCall("POST", "/api/class/create", {
                "name": name,
                "students": getSelectedStudentIDs()
            }, "/class");
        }
    });

    var getSelectedStudentIDs = function () {
        var students = elemStudentList.querySelectorAll("input");
        var i;
        var student_ids = [];
        for (i = 0; i < students.length; i += 1) {
            if (students[i].checked) {
                student_ids.push(+students[i].getAttribute("data-id"));
            }
        }
        return student_ids;
    };

    var addStudent = function (student) {
        var checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("data-id", student["Student ID"]);
        checkbox.setAttribute("data-name", student["Student Name"]);
        var label = document.createElement("LABEL");
        label.setAttribute("style", "display: block;");
        label.appendChild(checkbox);
        label.innerHTML += " " + student["Student Name"];
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

    btnToggleAllStudents.addEventListener("click", function () {
        var i, checkboxes = elemStudentList.querySelectorAll("input");
        var some_deselected = false;
        for (i = 0; i < checkboxes.length; i += 1) {
            if (!checkboxes[i].checked) {
                some_deselected = true;
                break;
            }
        }
        for (i = 0; i < checkboxes.length; i += 1) {
            checkboxes[i].checked = some_deselected;
        }
        this.innerHTML = (some_deselected
            ? "Deselect all"
            : "Select all");
    });

    document.getElementById("student-list").addEventListener("click", function () {
        var checkboxes = elemStudentList.querySelectorAll("input");
        var some_deselected = false;
        var i;
        for (i = 0; i < checkboxes.length; i += 1) {
            if (!checkboxes[i].checked) {
                some_deselected = true;
                break;
            }
        }
        btnToggleAllStudents.innerHTML = (some_deselected
            ? "Select all"
            : "Deselect all");
    });


    PM.apiCall("GET", "/api/students", null, function (response) {
        response.data.forEach(addStudent);
    });

    var matches = function (input, name) {
        var i, j;
        var input_parts = input.split(" ");
        var name_parts = name.split(",");
        // If any word in input is the beginning of any word in name, it's a match
        for (i = 0; i < name_parts.length; i += 1) {
            for (j = 0; j < input_parts.length; j += 1) {
                console.log(name_parts[i], "startsWith", input_parts[j]);
                // TODO: clean up
                if (name_parts[i].trim().toLowerCase().startsWith(input_parts[j].trim().toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    };

    inputCreateClassStudents.addEventListener("keyup", function () {
        var val = inputCreateClassStudents.value.trim();
        // Filter visibility of items in elemStudentList by the entered text
        var list = elemStudentList.querySelectorAll("input");
        var i, elem;
        for (i = 0; i < list.length; i += 1) {
            elem = list[i];
          console.log(elem);
            if (matches(val, elem.getAttribute("data-name"))) {
                elem.parentNode.parentNode.setAttribute("style", "display: block;");
            } else {
                elem.parentNode.parentNode.setAttribute("style", "display: none;");
            }
        }
    });
}());
