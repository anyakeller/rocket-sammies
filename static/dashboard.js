(function () {
  "use strict";
  var btnAssigns = document.getElementsByClassName("btn-assign");
  var modalAssign = document.getElementById("modal-assign");
  var btnCreateAssignment = document.getElementById("btn-create-assignment");
  var i;

  for (i = 0; i < btnAssigns.length; i++) {
      btnAssigns[i].addEventListener("click", function () {
          $(modalAssign).modal();
      });
  }

  var studentSelector = PM.studentSelector(document.getElementById("student-selection"));
  studentSelector.loadFromServer();

  btnCreateAssignment.addEventListener("click", function () {
    var studentIDs = studentSelector.getSelectedStudentIDs();
    // TODO: make assignment for those students
  });
}());
