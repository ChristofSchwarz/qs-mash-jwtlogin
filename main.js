function showErr(message) {
	var em = document.getElementById('error-message');
	em.style.display = 'block';
	em.innerText = message;
}

function redirWithBearer(redirUrl, bearer) {

	console.log('Redirecting to: ', redirUrl);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", redirUrl);
	xhr.setRequestHeader("Authorization", "Bearer " + bearer);
	xhr.setRequestHeader("cache-control", "no-cache");				
	xhr.withCredentials = true;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			switch (xhr.status) {
				case 200:
					window.location.href = redirUrl;
					break;
				default:
					console.error(xhr);
					return showErr('Error ' + xhr.status + ' ' + xhr.statusText);	
			}
		}
	};
	xhr.send();
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
			
			// Shortcut! if "bearer=" was provided as url query string
			// make a immediate redirect with that bearer as Authentication header
			var bearer = location.search.split('bearer=');
			if (bearer.length > 1) {
				bearer = bearer[1].split('&')[0];
				var redirUrl = config.redirUrl;
				redirUrl += ((redirUrl.indexOf('?') < 0) ? '?' : '&') + 'rnd=' + Math.random();
				redirWithBearer(redirUrl, bearer);
			}
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
getJson.send();  // this will load "config.json" from same relative path



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
		//const baseUrl = '/' + config.jwt_vproxy + '/';
		const targets = config.redir_targets;
		var targetId;
		var target;
		var thisVProxy = location.pathname.split('/extensions/')[0].replace('/','');
		var thisMashupName = location.pathname.split('/extensions/')[1].split('/')[0];
		
		if (!targets) {
			return showErr('No "redir_targets" configured in config.json');
		}
		if (user) {
			user = user.value.toLowerCase();
			if (user.length == 0) return showErr('Please enter username.');
			var userHash = CryptoJS.MD5(user) + "";
			userConfigEntry = config[userHash];
			if (userConfigEntry == undefined) return showErr('Unknown user');
			encToken = userConfigEntry[1];
			targetId = userConfigEntry[0];
			if (!config.redir_targets[targetId]) {
				return showErr('Undefined target number ' + targetId);
			} 
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
		
		var textSearch = [];
		if (thisVProxy) textSearch.push(thisVProxy);
		textSearch.push('extensions');
		textSearch.push(thisMashupName);
		textSearch.push('index.html');
		textSearch = textSearch.join('/');
		var textReplace = [];
		textReplace.push(config.jwt_vproxy);
		textReplace.push('extensions');
		textReplace.push(thisMashupName);
		textReplace.push('redir.html');
		textReplace = textReplace.join('/');
		
		var redirUrl = location.href.split(textSearch)[0] + textReplace + '?target=' + targetId.toString()
		   + '&rnd=' + Math.random();	

		redirWithBearer(redirUrl, bearer);
	});
});
