(function () {
    "use strict";
    var aid = document.getElementById("aid").value;
    var cid = document.getElementById("cid").value;
    var studentList = document.getElementById("student-selector");

    var selectedSID = null;
    var handleRadioBtnClicked = function (sid, name) {
        if (sid !== selectedSID) {
            // In this case, the selected student has CHANGED
            selectedSID = sid;
            console.log("Student number", sid, ", named", name, "was selected");
        }
    };

    var studentSelector = PM.studentSelector(studentList, {
        useRadio: true,
        onRadioClicked: handleRadioBtnClicked
    });
    studentSelector.loadClassFromServer(cid);
}());
