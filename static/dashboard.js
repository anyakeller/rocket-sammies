(function () {
  "use strict";
  var btnAssigns = document.getElementsByClassName("btn-assign");
  var modalAssign = document.getElementById("modal-assign");
  var btnCreateAssignment = document.getElementById("btn-create-assignment");
  var i;

  for (i = 0; i < btnAssigns.length; i++) {
      btnAssigns[i].addEventListener("click", function () {
          var aid = this.getAttribute("data-aid");
          var assign = !(this.getAttribute("data-assigned").toLowerCase() === "true");
          var data = {"assign": assign};
          this.disabled = true;
          PM.apiCall("POST", "/api/assignment/" + aid + "/assign", data, function(response) {
              this.setAttribute("data-assigned", response.assigned);
              if (response.assigned) {
                  this.innerHTML = "Unassign";
                  $.notify("Assignment assigned", "success");
              } else {
                  this.innerHTML = "Assign";
                  $.notify("Assignment unassigned", "success");
              }
              this.disabled = false;
          }.bind(this));
      });
  }
}());
