(function () {
    "use strict";

    // /////////////////////////////////////////////////////////////////////////
    // Editing properties of the the assignment
    var editAssignmentForm = document.getElementById("edit-assignment-form");
    var aid = document.getElementById("aid").value;
    var cid = document.getElementById("cid").value;

    var updateAssignment = function(data) {
        PM.apiCall("POST", "/api/assignment/" + aid + "/update", data, window.location);
    };

    editAssignmentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var data = {
            "title": document.getElementById("title").value,
            "description": document.getElementById("description").value,
            "max_score": document.getElementById("max-score").value,
        };
        var isGroupProject = document.getElementById("type") === "Group Project";
        if (isGroupProject) {
            data["max_group_size"] = document.getElementById("max-group-size").value
        }
        updateAssignment(data);
    });

    // /////////////////////////////////////////////////////////////////////////
    // Editing the rubric

    var initTable = document.getElementById('initial-table');

    // The `rubric` variable will be the authoritative copy of the rubric. When saving, we use this
    var rubric = JSON.parse(initTable.getAttribute('data-rubric'));

    var rubricTBody = initTable.querySelector('tbody');
    var inputNewDescription = document.getElementById('new-criterion-description');
    var inputNewMaxPoints = document.getElementById('new-criterion-maxpoints');
    var btnAddCriterion = document.getElementById('btn-new-criterion');

    var updateAssignmentRubric = function (onSuccess) {
        PM.apiCall("POST", "/api/assignment/" + aid + "/update", {
            "rubric": rubric
        }, onSuccess);
    };

    // Return how many <tr>s are before `tr` in `rubricTBody`
    // If the `tr` is not in `rubricTBody`, returns null
    var getRowIndex = function (tr) {
        var trs = rubricTBody.querySelectorAll("tr"), i;
        for (i = 0; i < trs.length; i++) {
            if (trs[i] === tr) {
                return i;
            }
        }
        return null;
    };

    var editBtnHandler = function () {
        // This handles two events: editing and updating
        // After hitting "Edit", this button changes to "Update"
        // After hitting "Update", it changes back to "Edit"
        var self = this;
        var target_tr = document.getElementById(this.getAttribute("for"));
        var tds = target_tr.querySelectorAll("td");
        var categoryTd = tds[0], maxScoreTd = tds[1];
        if (this.innerHTML === "Edit") {
            let category = categoryTd.innerHTML.trim();
            let maxScore = maxScoreTd.innerHTML.trim();

            let categoryInput = document.createElement("INPUT");
            categoryInput.setAttribute("type", "text");
            categoryInput.value = category;
            categoryTd.innerHTML = "";
            categoryTd.appendChild(categoryInput);

            let maxScoreInput = document.createElement("INPUT");
            // Use type=text so we can set size=3
            maxScoreInput.setAttribute("type", "text");
            maxScoreInput.setAttribute("size", "3");
            maxScoreInput.value = maxScore;
            maxScoreTd.innerHTML = "";
            maxScoreTd.appendChild(maxScoreInput);

            this.innerHTML = "Update";
        } else {
            let index = getRowIndex(target_tr);
            let categoryInput = categoryTd.querySelector("input");
            let maxScoreInput = maxScoreTd.querySelector("input");
            let category = categoryInput.value.trim();
            let maxScore = maxScoreInput.value.trim();
            if (!Number.isFinite(+maxScore) || +maxScore < 0 || +maxScore % 1 !== 0) {
                $.notify("Max points must be a whole number");
                return;
            }
            let newRow = {
                "category": category,
                "max_score": +maxScore
            };
            rubric[index] = newRow;
            updateAssignmentRubric(function () {
                categoryTd.innerHTML = category;
                maxScoreTd.innerHTML = maxScore;
                self.innerHTML = "Edit";
            });
        }
    };

    var addRowToTable = (function () {
        var counter = 0;
        return function (category, max_score) {
            counter += 1;
            var id = "rubric-row-" + counter;
            var tr = document.createElement("TR");
            tr.setAttribute("id", id);
            tr.innerHTML += "<td>" + category + "</td>";
            tr.innerHTML += "<td>" + max_score + "</td>";
            var lastTd = document.createElement("TD");
            var editBtn = document.createElement("BUTTON");
            editBtn.setAttribute("class", "btn btn-primary");
            editBtn.setAttribute("for", id);
            editBtn.innerHTML = "Edit";
            lastTd.appendChild(editBtn);
            tr.appendChild(lastTd);
            rubricTBody.appendChild(tr);

            editBtn.addEventListener("click", editBtnHandler);
        };
    }());

    btnAddCriterion.addEventListener('click', function () {
        var desc = inputNewDescription.value;
        var maxPoints = +inputNewMaxPoints.value;
        if (!Number.isFinite(maxPoints) || maxPoints < 0 || maxPoints % 1 != 0) {
            $.notify("Max points must be a whole number");
            return;
        }
        rubric.push({
            "category": desc,
            "max_score": maxPoints
        });
        addRowToTable(desc, maxPoints);
        updateAssignmentRubric(function () {
            inputNewDescription.value = "";
            inputNewMaxPoints.value = "";
        });
    });

    rubric.forEach(function (item) {
        addRowToTable(item.category, item.max_score);
    });

    // /////////////////////////////////////////////////////////////////////////
    // Assigning groups:

    var divStudentSelector = document.getElementById("group-maker-student-selector");
    // If this is not on the page, the assignment is not a group assignment,
    // and the rest of this function should not run
    if (divStudentSelector === null) {
        return;
    }

    var divGroups = document.getElementById("student-groups");
    var btnNewGroup = document.getElementById("btn-new-group");
    // Not implemented:
    // var btnAddToGroup = document.getElementById("btn-add-to-group");

    var students;
    var assignment;

    var studentSelector = PM.studentSelector(divStudentSelector, {"noSelectAll": true});

    // This function is ugly. removeBtnHandler is bound to "click" on the trash button
    // in the list of students in a group. It makes an API call to remove the student
    // from the group (identifying the group by its members), then removes the <li>
    // for that student.
    // Some of the jankiness here is due to the choice that we manually update the page
    // HTML rather than triggering a full page reload.
    var removeBtnHandler = function (event) {
        var student_li = this.parentNode;
        // Get the students in this group by iterating over the LIs in the HTML.
        var student_ids = [], i, student_LIs = student_li.parentNode.querySelectorAll("li");
        for (i = 0; i < student_LIs.length; i++) {
            student_ids.push(student_LIs[i].getAttribute("data-id"));
        }
        PM.apiCall("POST", "/api/assignment/" + aid + "/group-rm-member", {
            group: student_ids,
            sid: student_li.getAttribute("data-id")
        }, function () {
            student_li.remove();
        });
    };

    // Add an element to divGroups describing the group. The `students` parameters
    // is a list of objects containing "Student ID" and "Student Name" properties.
    // `student_ids` is a list of student ids
    var addGroupElement = function (students, student_ids) {
        var group = document.createElement("DIV");
        group.setAttribute("class", "group-student-list");
        group.innerHTML += "<h4>Group</h4>";
        var memberList = document.createElement("UL");
        students.forEach(function (s) {
            var inside_li = "";
            // The glyphicon:
            inside_li += '<button class="group-remove-student"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
            // Student's name:
            inside_li += s["Student Name"];
            var student_id = s["Student ID"];
            var li = document.createElement("LI");
            li.setAttribute("class", "group-student-item");
            li.setAttribute("data-id", student_id);
            li.innerHTML = inside_li;
            memberList.appendChild(li);
        });
        group.appendChild(memberList);
        divGroups.appendChild(group);
        var btns = group.querySelectorAll(".group-remove-student");
        var i;
        for (i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", removeBtnHandler);
        }
    };

    var setupGroupSelection = function () {
        var groups = assignment.groups;
        console.log(groups);
        btnNewGroup.addEventListener("click", function () {
            var students = studentSelector.getSelectedStudentIDsAndNames();
            var student_ids = [];
            students.forEach(function (s) {
                student_ids.push("" + s["Student ID"]);
            });
            PM.apiCall("POST", "/api/assignment/" + aid + "/add-group", {
                "group": student_ids
            }, function () {
                addGroupElement(students, student_ids);
            });
        });
    };

    // Make two API calls; after each are done, run setupGroupSelection:
    PM.apiCall("GET", "/api/assignment/" + aid, null, function (response) {
        assignment = response.data;
        if (students !== undefined) {
            setupGroupSelection();
        }
    });

    studentSelector.loadClassFromServer(cid, function (_students) {
        students = _students;
        if (assignment !== undefined) {
            setupGroupSelection();
        }
    });

    // Bind removeBtnHandler to the remove buttons on the page at initial
    // page load
    var removeFromGroupBtns = document.querySelectorAll(".group-remove-student");
    var i;
    for (i = 0; i < removeFromGroupBtns.length; i++) {
        removeFromGroupBtns[i].addEventListener("click", removeBtnHandler);
    }
}());
