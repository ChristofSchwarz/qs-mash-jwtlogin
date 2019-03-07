var config;
$.getJSON( "./config.json", function( ret ) {
	config = ret;
	delete config.logins["key"]; // remove one key from object 
	$("#loginServer").text(config.host);
	console.log(Object.keys(config.logins).length + ' user(s) set up.');	
});

window.addEventListener("load", function () {
	// Access the form element...
	var form = document.getElementById("login-form");

	// ...and take over its submit event.
	form.addEventListener("submit", function (event) {
		event.preventDefault();
		var em = document.getElementById('error-message');
		var user = document.getElementById("username-input").value.toLowerCase();
		var pwd = document.getElementById("password-input").value;
		if ((user.length * pwd.length) == 0) {
			$("#error-message").text("Please fill in username and password").css("display","block");
			return false;
		} 
		var lookup = CryptoJS.MD5(user) + "";
		var token = config.logins[lookup];
		if (token == undefined) {
			em.innerHTML = "Unknown user";
			em.style.display = 'block';
		} else {
			try {
				var bearer = CryptoJS.AES.decrypt(token, pwd).toString(CryptoJS.enc.Utf8);		

				$.ajax({
					type: "GET",
					beforeSend: function(request) {
							request.setRequestHeader("Authorization", "Bearer " + bearer);
					},
					url: "https://" + config.host + "/" + config.proxy + "/sense/app",
					success: function() {
						window.location.replace("https://" + config.host + "/" + config.proxy + "/" + config.target);
					},
					error: function (error) {
						console.log("error", error);
					}
				});
			}
			catch {
				$("#error-message").text("Invalid password").css("display","block");
			}
		}	
	});
});



