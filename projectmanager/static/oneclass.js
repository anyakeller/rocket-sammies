"use strict";
var singlebutton = document.getElementById("singlebutton");
var groupbutton = document.getElementById("groupbutton");

var singleCreateButton = document.getElementById('singleCreateButton');
var groupCreateButton = document.getElementById('groupCreateButton');

$("#singlebutton").click(function () {
    $("#singleForm").modal();
});

$("#groupbutton").click(function () {
    $("#groupForm").modal();
});

singleCreateButton.addEventListener("click", function(e){
    e.preventDefault();
    PM.apiCall("POST", "/api/assignment/create", {
        "title": document.getElementById("singleprojectTitle").value,
        "description": document.getElementById("singleprojectDescription").value,
        "cid":document.getElementById("singleprojectCid").value,
        "max_score":+document.getElementById("singleprojectMaxScore").value,
        "type": "Regular Assignment"
    }, window.location);
});
groupCreateButton.addEventListener("click", function(e){
    e.preventDefault();
    PM.apiCall("POST", "/api/assignment/create", {
        "title": document.getElementById("groupprojectTitle").value,
        "description": document.getElementById("groupprojectDescription").value,
        "cid":document.getElementById("groupprojectCid").value,
        "max_score":+document.getElementById("groupprojectMaxScore").value,
        "type": "Group Project",
        "max_group_size": document.getElementById("groupprojectMaxSize").value
    }, window.location);
});
