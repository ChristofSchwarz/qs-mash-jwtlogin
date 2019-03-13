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
			document.getElementById('error-message').style.display = 'block';
			document.getElementById('error-message').innerText = 'config.json has bad format';
			console.log(err);
		}	
	} else if (getJson.readyState == 4) {
		alert('Cannot get config.json');
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
		var em = document.getElementById('error-message');
		var user = document.getElementById("username-input").value.toLowerCase();
		var pwd = document.getElementById("password-input").value;
		if ((user.length * pwd.length) == 0) {
			em.style.display = 'block';
			em.innerText = 'Please fill in username and password';
			return false;
		} 
		var lookup = CryptoJS.MD5(user) + "";
		var token = config[lookup];
		if (token == undefined) {
			em.innerHTML = "Unknown user";
			em.style.display = 'block';
		} else {
			try {
				var bearer = CryptoJS.AES.decrypt(token, pwd).toString(CryptoJS.enc.Utf8);		
				var redirUrl = config.redirUrl;
				redirUrl += ((redirUrl.indexOf('?') < 0) ? '?' : '&') + 'rnd=' + Math.random();
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
						document.getElementById('error-message').style.display = 'block';
						document.getElementById('error-message').innerHTML = 'Your access-token was rejected.';							
					}
				};
				xhr.send();									

			}
			catch(err) {
				em.style.display = 'block';
				em.innerText = "Invalid password";
				console.log(err);
			}
		}	
	});
});
