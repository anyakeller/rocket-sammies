(function () {
    "use strict";

    var apiCall = function (method, url, data, success) {
	$.ajax({
	    method: method,
	    url: url,
	    data: data,
	    dataType: 'json'
	}).then(function (data, status, jqxhr) {
	    if (typeof data.redirect == "string") {
		window.location = data.redirect;
	    } else {
		success(data, status, jqxhr);
	    }
	}, function (jqxhr, status, err) {
	    console.err("XHR returned error: " + err);
	});
    };
}());
