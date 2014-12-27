var Q = require('q');
var path = require('path');
var fs = require('fs');

function readFile(previous, fileName) {
    return Q.promise(function (resolve, reject) {
        fs.readFile(path.join(process.cwd(), fileName),
            function (error, text) {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(previous + text.toString());
                }
            });
    });
}

//readFile('', '1.txt')
//    .then(function (previous) {
//        return readFile(previous, '2.txt');
//    })
//    .then(function (finalText) {
//        console.log(finalText);
//    })
//    .catch(function (error) {
//        console.log(error);
//    })
//    .done();

function readFileDynamic(fileName) {
    return function(previous) {
        return Q.promise(function (resolve, reject) {
            fs.readFile(path.join(process.cwd(), fileName),
                function (error, text) {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(previous + text.toString());
                    }
                });
        });
    }
}
//要读取的文件数组
var files = ['1.txt', '2.txt', '3.txt'];
//要构造的Promise链
var tasks = [];
files.forEach(function (fileName) {
    tasks.push(readFileDynamic(fileName));
});

var result = Q('');
tasks.forEach(function (f) {
    result = result.then(f);
});

result
    .then(function (finalText) {
        console.log(finalText);
    })
    .catch(function (error) {
        console.log(error);
    })
    .done();



