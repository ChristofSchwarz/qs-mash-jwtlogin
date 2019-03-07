var userDir = process.argv[2].toUpperCase();
var user = process.argv[3].toLowerCase();
var pass = process.argv[4];
if (user == undefined || pass == undefined || userDir == undefined) {
    console.log('This .js requires 3 parameters: [userDir] [user] [password] as command-line arguments.');
} else {
    console.log(`Creating token for user "${userDir}\\${user}", encrypted with password "${pass}"`);
    var jwt = require('jsonwebtoken');
    var fs = require('fs');
    var crypto = require('crypto-js');
    console.log(crypto.MD5('Hello'));
    //var CryptoJS = require('cryptojs');
    //console.log(CryptoJS);
    var privateKey = fs.readFileSync('./client_key.pem');
    var token = jwt.sign({ UserId: user, UserDirectory: userDir }, privateKey, { algorithm: 'RS512'});
    console.log('');
    console.log('JWT token below:');
    console.log('');
    console.log(token);
    var encryptedToken = crypto.AES.encrypt(token, pass);
    var encryptedUser = crypto.MD5(user);
    console.log('');
    console.log('Add this to config.json:');
    console.log('');
    console.log(`,"${encryptedUser}": "${encryptedToken}"`);
}

