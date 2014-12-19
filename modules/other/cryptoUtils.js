var crypto = require('crypto');
var algorithm = 'aes-256-cbc';
var delimiter = 'ø';

/*
 @secret private secret
 @args   var arguments
 @return encrypted string
 */
module.exports.encrypt = encrypt;
/*
 @secret private secret
 @str   encrypted string
 @return decrypted array
 */
module.exports.decrypt = decrypt;

function encrypt(secret, args) {
    var cipher = crypto.createCipher(algorithm, secret);
    args = Array.prototype.slice.call(arguments, 1);
    var str = args.join(delimiter);
    var result = cipher.update(str, 'utf8', 'hex');
    result += cipher.final('hex');
    return result;
}
function decrypt(secret, str) {
    var cipher = crypto.createDecipher(algorithm, secret);
    var result = cipher.update(str, 'hex', 'utf8');
    result += cipher.final('utf8');
    return result.split(delimiter);
}