(function () {
    "use strict";

    var categoryCreate = document.getElementById('create-rubric-row');
    console.log(categoryCreate.value);
    categoryCreate.addEventListener("submit", function (e) {
      var categoryDescription = document.getElementById('user-rubric-category').value;
      var categoryGrade = document.getElementById('user-rubric-grade').value;
      console.log(categoryDescription);
      console.log(categoryGrade);


    });



}());
