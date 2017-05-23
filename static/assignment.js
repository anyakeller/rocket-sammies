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
    //var button = document.getElementById("b1");
    form.appendChild(makeInput("text","singleprojectTitle","Title"));
    document.write("\n");
    form.appendChild(makeInput("text","singleprojectDescription","Description"));
    document.write("\n");
    form.appendChild(makeInput("text","singleprojectMaxScore","Max Score"));
    document.write("\n");
    form.createElement("b")
    form.setAttribute("action","/authenticate/");
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    document.body.appendChild(btn);
};

var loadformB = function(e){
    resetForm();
    form.appendChild(makeInput("text","groupprojectTitle","Title"));
    document.write("\n");
    form.appendChild(makeInput("text","groupprojectDescription","Description"));
    document.write("\n");
    form.appendChild(makeInput("text","groupprojectMaxScore","Max Score"));
    document.write("\n");
    form.appendChild(makeInput("text","groupprojectMaxSize","Max Group Size"));
    document.write("\n");
    //button.setAttribute("type","button");
    form.setAttribute("action","/intro/");
    state="reg1"
};
singlebutton.addEventListener("click",loadformA);
groupbutton.addEventListener("click",loadformB);
