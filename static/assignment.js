var form = document.getElementById("f1");
var singlebutton = document.getElementById("singlebutton");
var groupbutton = document.getElementById("groupbutton");

/*

//makeHidden hides all of the forms. This is used when reloading the "page"
var makeHidden = function(e){
    var inputs = document.getElementsByTagName("input");
    for(var i =0; i<inputs.length;i++){
	inputs[i].setAttribute("type","hidden");
    }
    return 0;
};
//reset form resets the entire form
var resetForm = function(e){
    var inputs = document.getElementsByTagName("input");
    while(inputs.length>0){
	inputs[0].remove();
    }
    console.log(inputs);
}
var makeInput = function(type, name, text){
    var ret = document.createElement("input");
    ret.setAttribute("type", type);
    ret.setAttribute("name", name);
    ret.setAttribute("required","required");
    ret.setAttribute("class","field");
    ret.setAttribute("value",text);
    return ret;
};

*/

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
