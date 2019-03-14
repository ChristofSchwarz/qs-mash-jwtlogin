function showErr(message) {
	var em = document.getElementById('error-message');
	em.style.display = 'block';
	em.innerText = message;
}

// Import config.json using native JavaScript
var getJson = new XMLHttpRequest;
var config;
getJson.open("GET", "./config.json?rnd=" + Math.random());
getJson.onreadystatechange = function() {
	if (getJson.readyState == 4 && getJson.status == 200) {
		try {
			config = JSON.parse(getJson.responseText);
			console.log((Object.keys(config).length - 1) + ' user(s) set up.');
		} 
		catch(err) {
			showErr('config.json has bad format');
			console.log(err);
		}	
	} else if (getJson.readyState == 4) {
		showErr('Cannot get config.json');
		console.log(getJson.status + ': ' + getJson.statusText);				
	}
}
getJson.send();



window.addEventListener("load", function () {
	// Access the form element...
	var form = document.getElementById("login-form");

	// ...and take over its submit event.
	form.addEventListener("submit", function (event) {
		event.preventDefault();
		var user = document.getElementById("username-input");
		var pwd = document.getElementById("password-input");
		var bearer = document.getElementById("token-input");
		var encToken;
		var redirUrl = config.redirUrl;
		redirUrl += ((redirUrl.indexOf('?') < 0) ? '?' : '&') + 'rnd=' + Math.random();		
		
		if (user) {
			user = user.value.toLowerCase();
			if (user.length == 0) return showErr('Please enter username.');
			var userHash = CryptoJS.MD5(user) + "";
			encToken = config[userHash];
			if (encToken == undefined) return showErr('Unknown user');
		}
		if (pwd) {
			pwd = pwd.value;
			if (pwd.length == 0) return showErr('Please enter password.');
		}
		if (bearer) {
			bearer = bearer.value
		} else {
			try {
				bearer = CryptoJS.AES.decrypt(encToken, pwd).toString(CryptoJS.enc.Utf8);		
			}
			catch (err) {
				return showErr('Invalid password');
			}
		}

		console.log('Redirecting to: ', redirUrl);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", redirUrl);
		xhr.setRequestHeader("Authorization", "Bearer " + bearer);
		xhr.setRequestHeader("cache-control", "no-cache");				
		xhr.withCredentials = true;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				window.location.href = redirUrl;
			} else if (xhr.readyState == 4) {
				return showErr('Your access-token was rejected.');		
			}
		};
		xhr.send();									
	});
});
