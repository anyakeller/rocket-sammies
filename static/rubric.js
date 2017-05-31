(function () {
    "use strict";
    var categoryCreate = document.getElementById('create-rubric-row');
    var createRubricTable = function(e){
      var categoryGrade = document.getElementById('user-rubric-grade');
      var categoryDescription = document.getElementById('user-rubric-category');
      // Create Table with the things
      var table = document.createElement("table");
      table.setAttribute("class","table table-inverse");
      table.setAttribute("style","width:50%;");

      var tablehead = document.createElement("thead");
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      var th2 = document.createElement('th');

      th.setAttribute("style","width:85%;");
      th2.setAttribute("style","width:15%;");
      table.appendChild(tablehead);
      table.appendChild(tr);
      table.appendChild(th);
      table.appendChild(th2);
      document.appendChild(table);


    }
    categoryCreate.addEventListener("click",createRubricTable);
}());
