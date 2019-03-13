# Create your tokens 

Prerequisites:
 * 3 node modules to be installed:
   - if you don't want to use NPM you can download the <a href="https://github.com/ChristofSchwarz/qs-mash-jwtlogin/raw/master/node_createtokens/createtoken.js_incl_modules.zip">.zip</a> which has all depending node_modules already installed
```
npm install crypto-js jsonwebtoken fs
```
 * place your RSA PRIVATE KEY file in the same folder as createtoken.js and name it __client_key.pem__
   - if you run this from the Qlik Sense Server computer, you don't have to copy client_key.pem, since createtoken.js will also look into "C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\.Local Certificates"
 
The format to create a new token is 
```
node createtoken.js directory userid password
```
You should see this:

![alttext](https://github.com/ChristofSchwarz/pics/raw/master/nodetoken.png "screenshot")

