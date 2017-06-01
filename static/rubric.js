(function () {
    "use strict";
    var rubricRowCreate = document.getElementById('submit-to-rubric-table');
    var openRubricModal = document.getElementById('create-rubric-row');
    var modalForRubrics = document.getElementById("modal-edit-rubric");

    var initTable = document.getElementById('initial-table');
    var tableRef = initTable.getElementsByTagName('tbody')[0];

    openRubricModal.addEventListener("click", function () {
        $(modalForRubrics).modal();
    });

    var createRubricTable = function(e){
      var categoryGrade = document.getElementById('user-rubric-grade').value;
      var categoryDescription = document.getElementById('user-rubric-category').value;
      // Create Table with the things

      var newRow = tableRef.insertRow(tableRef.rows.length);
      var newCell = newRow.insertCell(0);
      var newCell2 = newRow.insertCell(-1);
      var newText = document.createTextNode(categoryDescription);
      var newText2 = document.createTextNode(categoryGrade);
      newCell.appendChild(newText);
      newCell2.appendChild(newText2);
      $(modalForRubrics).modal('hide');



    }
    rubricRowCreate.addEventListener("click",createRubricTable);
}());
