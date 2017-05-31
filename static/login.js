(function () {
    "use strict";
    var apiLogin = function (email, pass) {
        PM.apiCall("POST", "/api/user/login", {
            email: email,
            password: pass
        }, "/dashboard");
    };

    var apiRegister = function (email, pass) {
        PM.apiCall("POST", "/api/user/register", {
            email: email,
            password: pass
        }, "/dashboard");
    };

    var loginForm = document.getElementById("login-form");
    var loginUName = document.getElementById("login-uname");
    var loginPass = document.getElementById("login-pass");

    var registerForm = document.getElementById("register-form");
    var registerUName = document.getElementById("register-uname");
    var registerPass1 = document.getElementById("register-pass1");
    var registerPass2 = document.getElementById("register-pass2");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        apiLogin(loginUName.value, loginPass.value);
    });

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (registerPass1.value !== registerPass2.value) {
            $.notify("Passwords do not match!", "error");
        } else {
            apiRegister(registerUName.value, registerPass1.value);
        }
    });
}());
