var safeStringify = require("fast-safe-stringify");
var fs = require("fs");
var flatstr = require("flatstr");
var newConsole = require("console").Console;
var config = require("../config");
var output = fs.createWriteStream(config.logFile, { flags: "a" });
var myConsole = new newConsole(output, output);

var logger = {};

logger.doLog = function doLog(level, msg, extra) {
  var timestamp = Date.now();

  var stringMsg = typeof msg === "string" ? msg : JSON.stringify(msg);
  var parsedMsg = stringMsg.replace(/(\r\n|\n|\r)/gm, " ");

  if (extra) {
    var stringExtra = typeof extra === "string" ? extra : JSON.stringify(extra);
    var parsedExtra = stringExtra.replace(/(\r\n|\n|\r)/gm, " ");
    myConsole.log(flatstr(safeStringify({ level, timestamp, message: msg + ' ' + parsedExtra})));
  } else {
    myConsole.log(flatstr(safeStringify({ level, timestamp, message: msg})));
  }

};

logger.verbose = function verbose(msg, extra) {
  if (config.logLevel <= 0) {
    logger.doLog("VERBOSE", msg, extra);
  }
};

logger.debug = function debug(msg, extra) {
  if (config.logLevel <= 1) {
    logger.doLog("DEBUG", msg, extra);
  }
};

logger.info = function info(msg, extra) {
  if (config.logLevel <= 2) {
    logger.doLog("INFO", msg, extra);
  }
};

logger.warn = function warn(msg, extra) {
  if (config.logLevel <= 3) {
    logger.doLog("WARN", msg, extra);
  }
};

logger.error = function error(msg, extra) {
  if (config.logLevel <= 4) {
    logger.doLog("ERROR", msg, extra);
  }
};

module.exports = logger;