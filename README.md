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
 - Create a token using node.exe and the client_key.pem
 - add the screen output to the config.json

![alttext](https://github.com/ChristofSchwarz/pics/raw/master/jwttokenslogin.gif "screenshot")

## How to use
 - navigate to this login.html page via the anonymous-only virtual proxy, e.g. if that proxy was "a" then this would be the url: 
https://qmi-qs-sn/a/extensions/login/login.html

## Security Concerns

This solution is based on Json Web Tokens which have been issued without a ValidTo-date and which are decrypted at client-side. There is no server authority checking the "local users", it works due to the fact that the issuer of the token has the private key of the certificate used at the virtual proxy.

To protect usernames, those are hashed.
To protect the JWT token, it can only be decrypted with a password chosen for that user. 

I am using CryptoJS for hashing, encrypting and decrypting. So it is quite hard to break in, but yet I don't recommend this as a production solution, just for setting up test users without any other dependency (such as Local Windows Users etc.)

