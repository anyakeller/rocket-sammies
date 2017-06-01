(function () {
    "use strict";
    var categoryCreate = document.getElementById('create-rubric-row');
    var initTable = document.getElementById('initial-table');
    var tableRef = initTable.getElementsByTagName('tbody')[0];

    var createRubricTable = function(e){
      var categoryGrade = document.getElementById('user-rubric-grade');
      var categoryDescription = document.getElementById('user-rubric-category');
      // Create Table with the things

      var newRow = tableRef.insertRow(tableRef.rows.length);
      var newCell = newRow.insertCell(0);
      var newCell2 = newRow.insertCell(-1);
      var newText = document.createTextNode("testingbutsbutsbuts");
      var newText2 = document.createTextNode("BUTTSBUTTSBUTTSBUTTS");
      newCell.appendChild(newText);
      newCell2.appendChild(newText2);
      



    }
    categoryCreate.addEventListener("click",createRubricTable);
}());
