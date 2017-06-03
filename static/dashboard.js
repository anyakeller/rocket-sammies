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
          PM.apiCall("POST", "/api/assignment/" + aid + "/assign", data, function(response) {
              this.setAttribute("data-assigned", response.assigned);
              if (response.assigned) {
                  this.innerHTML = "Deactivate";
                  $.notify("Assignment activated", "success");
              } else {
                  this.innerHTML = "Activate";
                  $.notify("Assignment deactivated", "success");
              }
          }.bind(this));
      });
  }
}());
