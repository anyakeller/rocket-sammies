var form = document.getElementById("f1");
var singlebutton = document.getElementById("singlebutton");
var groupbutton = document.getElementById("groupbutton");

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

var loadformA = function(e){
    resetForm();
    form.appendChild(makeInput("text","singleprojectTitle","Title"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("text","singleprojectDescription","Description"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("text","singleprojectMaxScore","Max Score"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    var submitFormAButton = makeInput("submit","submitFormA","Create");
    submitFormAButton.setAttribute("onclick","window.location = '/dashboard'");
    form.appendChild(submitFormAButton);
}

var loadformB = function(e){
    resetForm();
    form.appendChild(makeInput("text","groupprojectTitle","Title"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("text","groupprojectDescription","Description"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("text","groupprojectMaxScore","Max Score"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("text","groupprojectMaxSize","Max Group Size"));
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(makeInput("submit","submitFormB","Create"));
};


singlebutton.addEventListener("click",loadformA);
groupbutton.addEventListener("click",loadformB);
