(function () {
    "use strict";

    var apiCall = function (method, url, data, success, failure) {
	$.ajax({
	    method: method,
	    url: url,
	    data: JSON.stringify(data),
	    dataType: 'json'
	}).then(function (data, status, jqxhr) {
	    if (typeof success === "function") {
		success(data, status, jqxhr);
	    }
	    if (typeof data.redirect === "string") {
		window.location = data.redirect;
	    }
	}, failure);
    };

    var apiLogin = function (email, pass) {
	apiCall("POST", "/api/user/login", {
	    email: email,
	    password: pass
	}, function (response) {
	    if (response.success === 1) {
		window.location = "/dashboard";
	    } else {
		// TODO: better popup
		// TODO: better message (once backend is more detailed)
		alert("Authentication failed");
	    }
	});
    };

    var apiRegister = function (email, pass) {
	apiCall("POST", "/api/user/register", {
	    email: email,
	    password: pass
	}, function (response) {
	    if (response.success === 1) {
		window.location = "/dashboard";
	    } else {
		// TODO: better popup
		// TODO: better message (once backend is more detailed)
		alert("Authentication failed");
	    }
	});
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
	    alert("Passwords do not match!");
	} else {
	    apiRegister(registerUName.value, registerPass1.value);
	}
    });
}());
