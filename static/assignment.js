var form = document.getElementById("f1");
var singlebutton = document.getElementById("singlebutton");
var groupbutton = document.getElementById("groupbutton");

var singleCreateButton = document.getElementById('singleCreateButton');


    PM.apiCall("POST", "/api/class/create", {
        "name": name,
        "students": getSelectedStudentIDs()
    }, "/class");
}


var loadformA = function(e){
    document.getElementById('singleForm').style.display='block';
    document.getElementById('groupForm').style.display='none';
}

var loadformB = function(e){
    document.getElementById('singleForm').style.display='none';
    document.getElementById('groupForm').style.display='block';
};

document.getElementById('groupForm').style.display='none';
singlebutton.addEventListener("click",loadformA);
groupbutton.addEventListener("click",loadformB);
