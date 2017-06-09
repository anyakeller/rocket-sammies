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

    var rubricJSON = document.getElementById("grades-root").getAttribute("data-rubric");
    var rubric = JSON.parse(rubricJSON);
    var i;
    var updateGradeBtns = document.getElementsByClassName("update-grade-btn");
    var handleUpdateGrade = function (e) {
        // Copy the rubric into the grade:
        var grade = [], i;
        var sid = this.getAttribute("data-sid");
        var gradeEditSection = document.getElementById("grade-edit-" + sid);
        var inputs = gradeEditSection.querySelectorAll("input");
        for (i = 0; i < rubric.length; i++) {
            if (!Number.isFinite(+inputs[i].value) || +inputs[i].value < 0) {
                $.notify("Grades must be whole numbers");
                return;
            }
            grade.push(+inputs[i].value);
        }
        PM.apiCall("POST", "/api/grade/update", {
            "sid": sid,
            "aid": aid,
            "grades": grade
        });
    };
    for (i = 0; i < updateGradeBtns.length; i++) {
        updateGradeBtns[i].addEventListener("click", handleUpdateGrade);
    }
}());
