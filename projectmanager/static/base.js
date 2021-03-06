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
    var apiCall = function (method, url, data, after, failure) {
        method = method.toUpperCase();
        $.ajax({
            method: method,
            url: url,
            data: method === "POST" ? JSON.stringify(data) : data,
            contentType: method === "POST" ? "application/json" : "",
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
                if (typeof failure === "function") {
                    failure(data);
                }
            }
        }, function (response) {
            $.notify(response.message, "error");
        });
    };

    // Check if the given student name matches a search
    var testQuery = function (query, name) {
        var i, j;
        // Replace common punctuation with whitespace
        query = query.replace(/[,.;'"/]/g, " ");
        name = name.replace(/[,.;'"/]/g, " ");
        // Normalize all sequences of whitespace to one space, and trim
        query = query.replace(/[\s]+/g, " ").trim();
        name = name.replace(/[\s]+/g, " ").trim();
        // Normalize to lower case
        query = query.toLowerCase();
        name = name.toLowerCase();

        var query_parts = query.split(" ");
        var name_parts = name.split(" ");
        // If every word in query is the beginning of some word in name, it's a match
        var query_part_matched;
        for (j = 0; j < query_parts.length; j += 1) {
            query_part_matched = false;
            for (i = 0; i < name_parts.length; i += 1) {
                if (name_parts[i].startsWith(query_parts[j])) {
                    query_part_matched = true;
                    break;
                }
            }
            // If the query part didn't match any of the name_parts, the query doesn't match
            if (!query_part_matched) {
                return false;
            }
        }
        return true;
    };

    var studentSelector = (function () {
        // Util functions:
        var addStudent = function (studentList, student, formName, useRadio) {
            var checkbox = document.createElement("INPUT");
            var type = useRadio ? "radio" : "checkbox";
            checkbox.setAttribute("type", type);
            checkbox.setAttribute("data-id", student["Student ID"]);
            checkbox.setAttribute("data-name", student["Student Name"]);
            checkbox.setAttribute("data-visible", "true");
            if (formName) {
                checkbox.setAttribute("name", formName);
            }
            var label = document.createElement("LABEL");
            label.setAttribute("style", "display: block;");
            label.appendChild(checkbox);
            label.innerHTML += " " + student["Student Name"];
            var li = document.createElement("LI");
            li.setAttribute("data-name", student["Student Name"]);
            li.appendChild(label);
            studentList.appendChild(li);
        };

        // Used to uniquely identify each of possibly-multiple studentSelectors
        // on the same page
        var counter = 0;

        // The studentSelector function:
        // `container` is a <div> which studentSelector will populate with a list of
        // checkboxes and students, and a select-all/deselect-all button.
        // studentSelector returns an object with functions for addings students
        // to the list and getting which students are selected
        return function (container, options) {
            counter += 1;
            var formName = "student-selector-" + counter;
            options = options || {}; // default `options` to {}
            var studentNameInput = document.createElement("INPUT");
            studentNameInput.setAttribute("class", "form-control");
            studentNameInput.setAttribute("placeholder", "John Smith, Jane Doe, ...");
            studentNameInput.setAttribute("name", formName);

            var studentList = document.createElement("UL");
            studentList.setAttribute("class", "student-selection-list");

            var useRadio = !!options.useRadio;

            var toggleSelectAll;
            // the `options` parameter may have a property `noSelectAll`, which says
            // to exclude the toggleSelectAll button
            if (options.noSelectAll || useRadio) {
                toggleSelectAll = false;
            } else {
                toggleSelectAll = document.createElement("BUTTON");
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
                    if (toggleSelectAll) {
                        toggleSelectAll.innerHTML = (some_deselected
                                ? "Deselect all"
                                : "Select all");
                    }
                });
            }

            // If the user clicks anywhere in the list (on a student), refresh the
            // "Select all" / "Deselect all" button label
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
                if (toggleSelectAll) {
                    toggleSelectAll.innerHTML = (some_deselected
                        ? "Select all"
                        : "Deselect all");
                }
                studentNameInput.focus();
                if (useRadio && typeof options.onRadioClicked === "function") {
                    let selected;
                    for (i = 0; i < checkboxes.length; i += 1) {
                        if (checkboxes[i].checked) {
                            selected = checkboxes[i];
                            break;
                        }
                    }
                    if (selected) {
                        options.onRadioClicked(selected.getAttribute("data-id"), selected.getAttribute("data-name"));
                    }
                }
            });

            // Must be keyup, because at keydown the newly typed character hasn't been added to the <input> yet
            studentNameInput.addEventListener("keyup", function () {
                var val = studentNameInput.value.trim();
                // Filter visibility of items in studentList by the entered text
                var list = studentList.querySelectorAll("li");
                var i, elem;
                for (i = 0; i < list.length; i += 1) {
                    elem = list[i];
                    if (testQuery(val, elem.getAttribute("data-name"))) {
                        elem.setAttribute("style", "display: block;");
                        elem.querySelector("input").setAttribute("data-visible", "true");
                    } else {
                        elem.setAttribute("style", "display: none;");
                        elem.querySelector("input").setAttribute("data-visible", "false");
                    }
                }
            });

            // When the enter key is pressed, if the search has yielded only one student
            // toggle that student's checkbox
            studentNameInput.addEventListener("keydown", function (e) {
                var checkboxes, i;
                // keyCode 13 is the enter key
                if (e.keyCode === 13) {
                    checkboxes = studentList.querySelectorAll("input[data-visible=true]");
                    if (checkboxes.length === 1) {
                        checkboxes[0].checked = !checkboxes[0].checked;
                    }
                }
            });

            container.appendChild(studentNameInput);
            container.appendChild(studentList);
            if (toggleSelectAll) {
                container.appendChild(toggleSelectAll);
            }

            return {
                getSelectedStudentIDs: function () {
                    var students = studentList.querySelectorAll("input");
                    var i, student_ids = [];
                    for (i = 0; i < students.length; i += 1) {
                        if (students[i].checked) {
                            student_ids.push(+students[i].getAttribute("data-id"));
                        }
                    }
                    return student_ids;
                },

                getSelectedStudentIDsAndNames: function () {
                    var students = studentList.querySelectorAll("input");
                    var i, student_info = [];
                    for (i = 0; i < students.length; i += 1) {
                        if (students[i].checked) {
                            student_info.push({
                                "Student ID": +students[i].getAttribute("data-id"),
                                "Student Name": students[i].getAttribute("data-name")
                            });
                        }
                    }
                    return student_info;
                },

                deselectAll: function () {
                    var checkboxes = studentList.querySelectorAll("input"), i;
                    for (i = 0; i < checkboxes.length; i += 1) {
                        checkboxes[i].checked = false;
                    }
                },

                selectAll: function () {
                    var checkboxes = studentList.querySelectorAll("input"), i;
                    for (i = 0; i < checkboxes.length; i += 1) {
                        checkboxes[i].checked = true;
                    }
                },

                addStudent: function (studentData) {
                    addStudent(studentList, studentData, formName, useRadio);
                },

                loadFromServer: function () {
                    var self = this;
                    PM.apiCall("GET", "/api/students", null, function (response) {
                        response.data.forEach(function (studentData) {
                            self.addStudent(studentData);
                        });
                    });
                },

                clearStudents: function () {
                    studentList.innerHTML = "";
                },

                loadClassFromServer: function (cid, success) {
                    var self = this;
                    PM.apiCall("GET", "/api/class/" + cid + "/students", null, function (response) {
                        var students = [];
                        response.data.forEach(function (studentData) {
                            self.addStudent(studentData);
                            students.push(studentData);
                        });
                        if (typeof success === "function") {
                            success(students);
                        }
                    });
                }
            };
        };
    }());

    // Call Object.freeze to prevent future changes to
    // the object.
    return Object.freeze({
        apiCall: apiCall,
        testQuery: testQuery,
        studentSelector: studentSelector
    });
}());
