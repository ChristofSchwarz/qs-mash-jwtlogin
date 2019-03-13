var userDir = process.argv[2];
var user = process.argv[3];
var pass = process.argv[4];
const defaultCertPath = 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\.Local Certificates';

if (user == undefined || pass == undefined || userDir == undefined) {
    console.log('This .js requires 3 parameters: [userDir] [user] [password] as command-line arguments.');
} else {
    console.log(`Creating token for user "${userDir}\\${user}", encrypted with password "${pass}"`);
    var jwt = require('jsonwebtoken');
    var fs = require('fs');
    var crypto = require('crypto-js');
    var privateKeyFile = fs.existsSync('./client_key.pem')?`./client_key.pem`:`${defaultCertPath}\\client_key.pem`;
    console.log(`Using private key "${privateKeyFile}"`);
    var privateKey = fs.readFileSync(privateKeyFile);
    var token = jwt.sign({ UserId: user.toLowerCase(), UserDirectory: userDir.toUpperCase() }, privateKey, { algorithm: 'RS512'});
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
