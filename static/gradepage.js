(function () {
    "use strict";
    var aid = document.getElementById("aid").value;
    var cid = document.getElementById("cid").value;
    var studentList = document.getElementById("student-selector");

    var selectedSID = null;
    var handleRadioBtnClicked = function (sid, name) {
        if (sid !== selectedSID) {
            console.log("Student number", sid, ", named", name, "was selected");
            // In this case, the selected student has CHANGED
            if (selectedSID !== null) {
                document.getElementById("grade-edit-" + selectedSID).setAttribute("style", "display: none;");
            }
            document.getElementById("grade-edit-" + sid).setAttribute("style", "display: block;");
            selectedSID = sid;
        }
    };

    var studentSelector = PM.studentSelector(studentList, {
        useRadio: true,
        onRadioClicked: handleRadioBtnClicked
    });
    studentSelector.loadClassFromServer(cid);

    var i;
    var updateGradeBtns = document.getElementsByClassName("update-grade-btn");
    var handleUpdateGrade = function (e) {
        // TODO: make api call
    };
    for (i = 0; i < updateGradeBtns.length; i++) {
        updateGradeBtns[i].addEventListener("click", handleUpdateGrade);
    }
}());
