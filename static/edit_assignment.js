(function () {
    "use strict";

    var editAssignmentForm = document.getElementById("edit-assignment-form");
    var aid = document.getElementById("aid").value;
    var cid = document.getElementById("cid").value;

    var updateAssignment = function(aid, data) {
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
        updateAssignment(aid, data);
    });


      // THIS IS THE JAVASCRIPT FOR THE RUBRIC FORMS ADDED BY DHIRAJATORY STATEMENTS
      var rubricRowCreate = document.getElementById('submit-to-rubric-table');
      var openRubricModal = document.getElementById('create-rubric-row');
      var modalForRubrics = document.getElementById("modal-edit-rubric");

      var initTable = document.getElementById('initial-table');
      var tableRef = initTable.getElementsByTagName('tbody')[0];

      openRubricModal.addEventListener("click", function () {
          $(modalForRubrics).modal();
      });


      var createRubricTable = function(e){

          var categoryDescription = document.getElementById('user-rubric-category').value;

          // Create Table with the things
          var newRow = tableRef.insertRow(tableRef.rows.length);
          var newCell = newRow.insertCell(0);
          var newCell2 = newRow.insertCell(-1);
          var newText = document.createTextNode(categoryDescription);
          newCell.appendChild(newText);
          

          // clear the modal input fields

          document.getElementById("user-rubric-category").value = "";


          // send the data to backend using hidden html forms
          $(modalForRubrics).modal('hide');

      }
      rubricRowCreate.addEventListener("click",createRubricTable);

      var createRubricForm = function(e){
          var form = document.createElement('form');
          form.setAttribute('action',"/sendRubricData")
          form.setAttribute('method','GET');
          var hiddenInput = document.createElement('input');
          hiddenInput.setAttribute('type','hidden');
          form.appendChild(hiddenInput);

      }









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

    var removeBtnHandler = function (event) {
        console.log("remove", this);
        var student_li = this.parentNode;
        var student_ids = [], i, student_lis = student_li.parentNode.querySelectorAll("li");
        for (i = 0; i < student_lis.length; i++) {
            student_ids.push(student_lis[i].getAttribute("data-id"));
        }
        PM.apiCall("POST", "/api/assignment/" + aid + "/group-rm-member", {
            group: student_ids,
            sid: student_li.getAttribute("data-id")
        }, function () {
            student_li.remove();
        });
    };

    // Add an element to divGroups describing the group. Students in the group are `students`
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

    var removeFromGroupBtns = document.querySelectorAll(".group-remove-student");
    var i;
    for (i = 0; i < removeFromGroupBtns.length; i++) {
        removeFromGroupBtns[i].addEventListener("click", removeBtnHandler);
    }
}());
