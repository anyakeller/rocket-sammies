// This is our base JS file. The PM object will have
// utility methods used in multiple pages, and nothing
// should happen when running this file other than
// making the PM object.
var PM = (function () {
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
    // Call Object.freeze to prevent future changes to
    // the object.
    return Object.freeze({
        apiCall: apiCall
    });
}());
