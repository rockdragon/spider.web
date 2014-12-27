var async = require('async');
var path = require('path');
var fs = require('fs');

function readFile4WaterFall(previous, fileName, callback) {
    fs.readFile(path.join(process.cwd(), fileName),
        function (error, text) {
            callback(error, previous + text.toString());
        });
}
async.waterfall(
    [
        function (callback) {
            readFile4WaterFall('', '1.txt', callback)
        },
        function (previous, callback) {
            readFile4WaterFall(previous, '2.txt', callback);
        }
    ], function (err, result) {
        console.log(result);
    }
);


function readFile4Series(fileName, callback) {
    fs.readFile(path.join(process.cwd(), fileName),
        function (error, text) {
            callback(error, text.toString());
        });
}
async.series(
    [
        function (callback) {
            readFile4Series('1.txt', callback)
        },
        function (callback) {
            readFile4Series('2.txt', callback);
        }
    ], function (err, result) {
        console.log(result);
    }
);