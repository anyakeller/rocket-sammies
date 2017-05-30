// This is our base JS file. The PM object will have
// utility methods used in multiple pages, and nothing
// should happen when running this file other than
// making the PM object.
var PM = (function () {
    "use strict";
    // apiCall is a utility for sending or requesting data from the server
    // and responding to it (pass a URL for `after` to redirect to that URL
    // on success, or a function to be called on success). On failure, it
    // shows an error notification using the error message from the server.
    var apiCall = function (method, url, data, after) {
	$.ajax({
	    method: method,
	    url: url,
	    data: JSON.stringify(data),
        contentType: "application/json",
	    dataType: 'json'
	}).then(function (data, status, jqxhr) {
      if (data.success) {
        console.log("Sucessful response:", data);
        if (typeof after === "string" || after instanceof Location) {
            window.location = after;
        } else if (typeof after === "function" ) {
            after(data);
        }
      } else {
        console.error("Error in response:", data);
        $.notify(data.message, "error");
      }
	}, function (response) {
	    $.notify(response.message, "error");
	});
    };

    var studentSelector = (function () {
        // Util functions:
        var addStudent = function (studentList, student) {
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
            studentList.appendChild(li);
        };

        var getSelectedStudentIDs = function (studentList) {
            var students = studentList.querySelectorAll("input");
            var i;
            var student_ids = [];
            for (i = 0; i < students.length; i += 1) {
                if (students[i].checked) {
                    student_ids.push(+students[i].getAttribute("data-id"));
                }
            }
            return student_ids;
        };

        // Check if the given student name matches the search the user has typed
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

        // The studentSelector function:
        // `container` is a <div> which studentSelector will populate with a list of
        // checkboxes and students, and a select-all/deselect-all button.
        // studentSelector returns an object with functions for addings students
        // to the list and getting which students are selected
        return function (container) {
            var studentNameInput = document.createElement("INPUT");
            studentNameInput.setAttribute("class", "form-control");
            studentNameInput.setAttribute("placeholder", "John Smith, Jane Doe, ...");
            var studentList = document.createElement("UL");
            studentList.setAttribute("class", "student-selection-list");
            var toggleSelectAll = document.createElement("BUTTON");
            toggleSelectAll.innerHTML = "Select all";
            toggleSelectAll.setAttribute("class", "btn btn-default");
            toggleSelectAll.addEventListener("click", function () {
                var i, checkboxes = studentList.querySelectorAll("input");
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
                toggleSelectAll.innerHTML = (some_deselected
                    ? "Deselect all"
                    : "Select all");
            });

            // If the user clicks anywhere in the list (on a student), refresh the
            // "Select all" / "Deselent all" button label
            studentList.addEventListener("click", function () {
                var checkboxes = studentList.querySelectorAll("input");
                var some_deselected = false;
                var i;
                for (i = 0; i < checkboxes.length; i += 1) {
                    if (!checkboxes[i].checked) {
                        some_deselected = true;
                        break;
                    }
                }
                toggleSelectAll.innerHTML = (some_deselected
                    ? "Select all"
                    : "Deselect all");
            });

            studentNameInput.addEventListener("keyup", function () {
                var val = studentNameInput.value.trim();
                // Filter visibility of items in studentList by the entered text
                var list = studentList.querySelectorAll("input");
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

            container.appendChild(studentNameInput);
            container.appendChild(studentList);
            container.appendChild(toggleSelectAll);

            return {
                getSelectedStudentIDs: function () {
                    return getSelectedStudentIDs(studentList);
                },
                addStudent: function (studentData) {
                    addStudent(studentList, studentData);
                },
                loadFromServer: function () {
                    var self = this;
                    PM.apiCall("GET", "/api/students", null, function (response) {
                        response.data.forEach(function (studentData) {
                            self.addStudent(studentData);
                        });
                    });
                }
            };
        };
    }());

    // Call Object.freeze to prevent future changes to
    // the object.
    return Object.freeze({
        apiCall: apiCall,
        studentSelector: studentSelector
    });
}());
