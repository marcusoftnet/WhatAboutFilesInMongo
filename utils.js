var fs = require("fs");
var config = require('./config.js').config;
var mongoGridAccess = require('./usingMongoDriver.js');

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
	var gridAccess = require("./usingMongooseGridFs.js");
	gridAccess.removeAllFiles();
	// mongoGridAccess.unlinkFile(TEST_FILENAME);
	// mongoGridAccess.unlinkFile(TEST_TEXTFILENAME);

	// mongoGridAccess.unlinkAllFiles();
	// mongoGridAccess.removeAllFiles(function (result) { });
};

module.exports.deleteFileFromDisk = function(filepath){
	if(fs.existsSync(filepath)){
		fs.unlinkSync(filepath);
	}
};