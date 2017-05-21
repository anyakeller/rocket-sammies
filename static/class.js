(function () {
    "use strict";
    var btnNewClass = document.getElementById("btn-new-class");
    var modalNewClass = document.getElementById("modal-new-class");
    var inputNewClassName = document.getElementById("input-new-class-name");
    var btnImportClass = document.getElementById("btn-import-class");
    var inputCreateClassStudents = document.getElementById("input-create-class-students");
    var btnCreateClass = document.getElementById("btn-create-class");

    btnNewClass.addEventListener("click", function () {
        $(modalNewClass).modal();
    });

    btnCreateClass.addEventListener("click", function () {
        PM.apiCall("POST", "/api/class/create", {
            "name": inputNewClassName.value
        }, "/class");
    });
}());
