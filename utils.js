var fs = require("fs");
var config = require('./config.js').config;
var mongoGridAccess = require('./usingMongoDriver.js');

module.exports.mark = function () {
	console.log("##############################")
};

module.exports.removeAllFiles = function () {
	mongoGridAccess.removeAllFiles(function (result) {
		// I don't really care about the result in this case
	});
	//TODO: Get this to work...
	/*mongoGridAccess.unlinkAllFiles(function () {
		// or this result
	});*/
};

module.exports.deleteFromDisk = function(filepath){
	if(fs.existsSync(filepath)){
		fs.unlinkSync(filepath);
	}
};