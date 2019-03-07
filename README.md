# qs-mash-jwtlogin
Custom Login Page with JWT and self-contained authorization. 
Special thanks to Thomas Haenig, Akquinet sharing this https://github.com/q2g/q2g-web-jwtproxyredirect which is at the heart of this solution.

## How to set up
Install and upload this extension (download as .zip)
 - Create two virtual proxies
   * one with authentication set to "only anonymous" 
   * one with authentication JWT. Paste the certificate there (if you have no own, put the client.pem content from C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\.Local Certificates
 - navigate to this login.html page via the anonymous-only virtual proxy, e.g. if that proxy was "a" then this would be the url: 
https://qmi-qs-sn/a/extensions/login/login.html
 - Open the "Login" mashup with /dev-hub and edit the config.json page
 - Create a token using node.exe and the client_key.pem
 - add the screen output to the config.json

![alttext](https://github.com/ChristofSchwarz/pics/raw/master/jwttokenslogin.gif "screenshot")

## Security Concerns

This solution is based on Json Web Tokens which have been issued without a ValidTo-date and which are decrypted at client-side. There is no server authority checking the "local users", it works due to the fact that the issuer of the token has the private key of the certificate used at the virtual proxy.

To protect usernames, those are hashed.
To protect the JWT token, it can only be decrypted with a password chosen for that user. 

I am using CryptoJS for hashing, encrypting and decrypting.
