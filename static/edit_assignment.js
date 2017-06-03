(function() {
    "use strict";

    var editAssignmentForm = document.getElementById("edit-assignment-form");

    var updateAssignment = function(aid, data) {
        PM.apiCall("POST", "/api/assignment/" + aid + "/update", data, window.location);
    }

    editAssignmentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var aid = document.getElementById("aid").value;
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
}());
