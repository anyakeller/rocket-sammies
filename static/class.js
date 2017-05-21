(function () {
    "use strict";
    var btnNewClass = document.getElementById("btn-new-class");
    var newClassModal = document.getElementById("modal-new-class");
    var inputNewClassName = document.getElementById("input-new-class-name");
    var btnImportClass = document.getElementById("btn-import-class");
    var inputCreateClassStudents = document.getElementById("input-create-class-students");

    btnNewClass.addEventListener("click", function () {
        $(newClassModal).modal();
    });
}());
