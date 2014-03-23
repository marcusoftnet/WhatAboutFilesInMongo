var fs = require("fs");
var config = require('./config.js').config;
var gridAccess = require("./usingMongooseGridFs.js");

var TEST_FILENAME = 'testing.gif';
var TEST_TEXTFILENAME = 'testing.text';
module.exports.TEST_TEXTFILENAME = 'testing.text';
module.exports.TEST_FILENAME = 'testing.gif';

module.exports.GetTestKey = function () {
	return "akey_" + Math.random();
};

module.exports.mark = function () {
	console.log("##############################")
};

module.exports.removeAllFiles = function () {
	gridAccess.removeAllFiles();
	gridAccess.deleteFileByFileName(TEST_FILENAME);
	gridAccess.deleteFileByFileName(TEST_TEXTFILENAME);
};

module.exports.deleteFileFromDisk = function(filepath){
	if(fs.existsSync(filepath)){
		fs.unlinkSync(filepath);
	}
};