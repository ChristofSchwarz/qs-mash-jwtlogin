# qs-mash-jwtlogin
Custom Login Page with JWT and self-contained authorization. 
Special thanks to Thomas Haenig, Akquinet sharing this https://github.com/q2g/q2g-web-jwtproxyredirect which is at the heart of this solution.

## How to set up
Install and upload this extension (download as .zip)
 - Create two virtual proxies
   * one with authentication set to "only anonymous" 
   * one with authentication JWT. To set it up, you will need the certificate (if you have no own reuse the client.pem content from C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\\.Local Certificates)
 - Open and edit the "Login" mashup with /dev-hub and edit the config.json page
 - Edit the settings for host, proxy (the one you set up with JWT) and target address (like /hub or /hub/stream/xxx)
 - You need NodeJS and the createtoken.js found in subfolder <a href="https://github.com/ChristofSchwarz/qs-mash-jwtlogin/tree/master/node_createtokens">node_createtokens</a>
   * Copy the matching client_key into the same folder (node_createtokens) as file "client_key.pem"
   * issue some tokens for users.
 - copy/paste the screen output to the config.json which looks like this
 ```
 Add this to config.json:

,"5d9c68c6c50ed3d02a2fcf54f63993b6": "U2FsdGVkX1+0GqoqLpMd+0UyMlxyt636nMXTJKKANekjFescZVG2eFTvxPOqAixplmjhGQyWXRRFtVrf3Qm4ObXqlMisYe44PQhNAGa+Q7K3eviwFgfENJH/ej1pIQFGlACRy1eniEqpw/d93XLaPlpOOrHfEFr2cjt5kRPTdbTikJvVnBhO0inyd+WIpPeCXgKS3R3aTXBpGLouVPwd6JGlJtPxwiSXVc8Gdp8lz6vp++8VPtUGIJIqCejOfvAQIStKAyVNqZUyZO7tp8JAJyKI25Du1k4bwutPRRivWzx34hTNS6Ul+I3qVMPk+YjD6Qbd+GxoDav8tnybua0AECIbRxjjVXIttWELXdWNpMZKlQQ+jVKOea7RdNmZvX7MYATNmVYacpvfUEw41UbXN/+hZe/8mL+Re7cbZe4ahO5ZIMLJImns8wQUhcMX3l1aPPptyqdlL6svtbsI766ZYfVal4aMunEp2zEqY/s4rDWU3y5S9Ufhj7ehGUtjcXu5Op1qjGSgtUmoNLO2uOkFuB6rqrFgU7+s1QIfLl7Pyx8AdIuI6Yj2+n7npGrjcvRgSA9nC0bwn/88sH+Eyn73KWr0fbsl/FOAGpTnAUwWzu0tNH+DzAQRvrZuS057//Ao8f57lPbSWo9TAXrh8lhx5Q=="
 ```

![alttext](https://github.com/ChristofSchwarz/pics/raw/master/jwttokenslogin.gif "screenshot")

## How to use
 - navigate to this login.html page via the anonymous-only virtual proxy, e.g. if that proxy was "a" then this would be the url: 
https://qmi-qs-sn/a/extensions/login/login.html

## Security Concerns

This solution is based on Json Web Tokens which have been issued without a ValidTo-date and which are decrypted at client-side. There is no server authority checking the "local users", it works due to the fact that the issuer of the token has the private key of the  same certificate used at the virtual proxy (bearer authentication).

 - To protect userid names, those are hashed.
 - To protect the JWT tokens, they were encrpyted with the choosen password during creation of the token
 - it can only be decrypted with the same password entered by that user
 - Everyone who uses that login can get access to the mapping table found in config.json (userid hashes and encrpyted bearer tokens) but noone can reuse it, giving a minimal chance for attacks.

I am using CryptoJS for hashing, encrypting and decrypting. So it is quite hard to break in, but yet __I don't recommend this as a production solution__, just for setting up test users without any other dependency (such as Local Windows Users etc.)

