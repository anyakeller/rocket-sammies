var form = document.getElementById("f1");
var singlebutton = document.getElementById("singlebutton");
var groupbutton = document.getElementById("groupbutton");

var singleCreateButton = document.getElementById('singleCreateButton');

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
singleCreateButton.addEventListener("click",
  function(){
    PM.apiCall("POST", "/api/assignment/create", {
      "title": document.getElementsByName("singleprojectTitle")
      "description": document.getElementsByName("singleprojectDescription")
      "cid":document.getElementsByName("singleprojectCid")
      "max_score":document.getElementsByName("singleprojectMaxScore")
      "_type": document.getElementsByName("singleType")
    }, "/assignment");

    }

)
