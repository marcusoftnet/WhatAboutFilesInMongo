var fs = require("fs");
var config = require('./config.js').config;
var mongoGridAccess = require('./usingMongoDriver.js');

var TEST_FILENAME = 'testing.gif';
var TEST_TEXTFILENAME = 'testing.text';

module.exports.TEST_TEXTFILENAME = 'testing.text';
module.exports.TEST_FILENAME = 'testing.gif';

module.exports.mark = function () {
	console.log("##############################")
};

module.exports.removeAllFiles = function () {
	mongoGridAccess.unlinkFile(TEST_FILENAME);
	mongoGridAccess.unlinkFile(TEST_TEXTFILENAME);

	mongoGridAccess.removeAllFiles(function (result) { });
	
};

module.exports.deleteFileFromDisk = function(filepath){
	if(fs.existsSync(filepath)){
		fs.unlinkSync(filepath);
	}
};