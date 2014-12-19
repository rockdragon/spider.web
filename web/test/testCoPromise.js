var co = require('co');
var fs = require('fs');

function readFile(fileName){
    return function(cb){
        fs.readFile(fileName, cb);
    };
}

module.exports.read = function(fileName){
    return co(function*(){
       return yield readFile(fileName);
    });
};