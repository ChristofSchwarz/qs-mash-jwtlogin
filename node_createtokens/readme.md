# Create your tokens 

Prerequisites:
 * 3 node modules to be installed:
```
npm install crypto-js jsonwebtoken fs
```
 * place your RSA PRIVATE KEY file in the same folder as createtoken.js and name it __client_key.pem__
 
The format to create a new token is 
```
node createtoken.js directory userid password
```
You should see this:

![alttext](https://github.com/ChristofSchwarz/pics/raw/master/nodetoken.png "screenshot")

