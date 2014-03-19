var config = require('./config.js').config;
var mongoGridAccess = require('./mongodriver.js');

module.exports.mark = function () {
	console.log("##############################")
};

module.exports.removeAllFiles = function () {
	mongoGridAccess.removeAllFiles(function (result) {
		// body...
	});
};