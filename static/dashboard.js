(function () {
  "use strict";
  var btnAssign = document.getElementById("btn-assign");
  var modalAssign = document.getElementById("modal-assign");
  var btnCreateAssignment = document.getElementById("btn-create-assignment");

  btnAssign.addEventListener("click", function () {
      $(modalAssign).modal();
  });

  var studentSelector = PM.studentSelector(document.getElementById("student-selection"));
  studentSelector.loadFromServer();

  btnCreateAssignment.addEventListener("click", function () {
    var studentIDs = studentSelector.getSelectedStudentIDs();
    // TODO: make assignment for those students
  });
}());
