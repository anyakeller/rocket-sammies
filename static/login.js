(function () {
    "use strict";

    var apiCall = function (method, url, data, redirect) {
	$.ajax({
	    method: method,
	    url: url,
	    data: data,
	    dataType: 'json'
	    // jQuery stringifies as JSON automatically
	}).then(function (data, status, jqxhr) {
      if (data.success) {
        console.log("Sucessful response:", data);
        window.location = redirect;
      } else {
        console.error("Error in response:", data);
        $.notify(data.message, "error");
      }
	}, function (response) {
	    $.notify(response.message, "error");
	});
    };

    var apiLogin = function (email, pass) {
	apiCall("POST", "/api/user/login", {
	    email: email,
	    password: pass
	}, "/dashboard");
    };

    var apiRegister = function (email, pass) {
	apiCall("POST", "/api/user/register", {
	    email: email,
	    password: pass
	}, "/dashboard");
    };

    var loginBtn = document.getElementById("btn-login");
    var loginUName = document.getElementById("login-uname");
    var loginPass = document.getElementById("login-pass");
    var registerBtn = document.getElementById("btn-register");
    var registerUName = document.getElementById("register-uname");
    var registerPass1 = document.getElementById("register-pass1");
    var registerPass2 = document.getElementById("register-pass2");

    loginBtn.addEventListener("click", function (e) {
	e.preventDefault();
	apiLogin(loginUName.value, loginPass.value);
    });

    registerBtn.addEventListener("click", function (e) {
	e.preventDefault();
	if (registerPass1.value !== registerPass2.value) {
	    // TODO: better alerts
	    $.notify("Passwords do not match!", "error");
	} else {
	    apiRegister(registerUName.value, registerPass1.value);
	}
    });
}());
