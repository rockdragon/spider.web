var winston = require('winston');
var path = require('path');
var fs = require('fs');
var pathUtils = require('../other/pathUtils');
var getAbsolutePath = require('../other/pathUtils').getAbsolutePath;
var logPath = getAbsolutePath('logs/');

if (!fs.existsSync(logPath)) {
    pathUtils.mkdirAbsoluteSync(logPath);
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({colorize: true}),
        new (winston.transports.DailyRotateFile)({
            name: 'file',
            datePattern: '.yyyy-MM-dd.log',
            json: false,
            filename: path.join(logPath, 'log')
        })
    ]
});

/*
 supply a integration of console-logger and file-logger
 * */
module.exports.info = function (msg) {
    logger.info(msg);
};
module.exports.error = function (msg) {
    logger.error(msg);
};
