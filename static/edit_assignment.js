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

    var studentSelector = PM.studentSelector(divStudentSelector);

    // Add an element to divGroups describing the group. Students in the group are `students`
    var addGroupElement = function (students) {
        var group = document.createElement("DIV");
        group.setAttribute("class", "group-student-list");
        group.innerHTML += "<h4>Group</h3>";
        var memberList = document.createElement("UL");
        students.forEach(function (s) {
            memberList.innerHTML += "<li data-id='" + s["Student ID"] + "'>" + s["Student Name"] + "</li>";
        });
        group.appendChild(memberList);
        divGroups.appendChild(group);
    };

    var setupGroupSelection = function () {
        var groups = assignment.groups;
        console.log(groups);
        btnNewGroup.addEventListener("click", function () {
            var students = studentSelector.getSelectedStudentIDs();
            addGroupElement(students);
            PM.apiCall("POST", "/api/assignment/" + aid + "/add-group", {
                "group": students
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
}());
