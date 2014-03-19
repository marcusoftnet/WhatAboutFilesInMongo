var mongo = require('mongodb');
var Db = mongo.Db;
var fs = require('fs');
var Grid = require('gridfs-stream');
var config = require('./config.js').config;
var utils = require('./utils.js');
var imgDir = "./img/";


module.exports.storeFileFromDisk = function (filename, key, callback) {
	// we first need to open the mongo database
	Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
		// now we create the Grid (from the gridfs-stream package)
		// passing the db and the mongo-object
		// Watch out here. This is NOT the mongo.Grid but rather the
		// var Grid = require('gridfs-stream') from above
		// the db and the mongo are from the 
		// var mongo = require("mongo") and var db = mongo.db respectively
		var gfs = Grid(db, mongo);

		// Oh man, here they go again with the streams...
		// Well I supposed that could be expected considering 
		// the name of the package.
		// I. Will. Understand. This. 
		// These are not the streams you've come to hate, he said and made a swooping gesture with his hand

		// Ok, we create a stream passing the name 
		// and content type of the file
		// as well as some meta data that we will use to search for the file
		var writestream = gfs.createWriteStream({
		    filename: filename, 
		    metadata : { key : key }
		});
	
		// And now... we create a read stream for the file...
		// and pipe it to the write stream... 
		// I must lay down awhile.

		// Ok, a readstream is used to read stuff with
		// and piping it is just telling it what's going to happen next...
		// But AHA, I think I got it. 
		// the first read stream is from the fs (FileSystem)
		// This line is basically saying this:
		// - read the filename into a stream from the file system
		// - and take that result and use that for the write stream
		var filePath = imgDir + filename;
		fs.createReadStream(filePath).pipe(writestream);

		// Let's for now just say that it worked
		callback('Dude, it worked!');
	});
};

var getFileInfoByKeyInMetadata = function (keySentIn, callback) {
	// I'll loosen up the commenting
	Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
		// Noteworthy that we only need the database here...
		var gfs = Grid(db, mongo);

		// Now we query the file meta-data (remember that files are stored in two collections
		// one for metadata (files) and one for the raw binary (chunks))
		// this might look a bit strange around the metadata structure, normally you wou
		// but metadata is an object  structure, and we're searching my, own made up,
		// key-field of it. 
		gfs.files.findOne({ metadata: {key : keySentIn} }, function (err, fileInfo) {
    		if (err) console.log(err);
    		callback(fileInfo);
		});
	});
};
module.exports.getFileInfoByKeyInMetadata = getFileInfoByKeyInMetadata;


module.exports.streamFileForKey = function (key, callback) {
	getFileInfoByKeyInMetadata(key, function (fileInfo) {
		Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
			// Create the gridfs-stream object as normal
			var gfs = Grid(db, mongo);

			// and now create a readstream and pass it back
			var rs = gfs.createReadStream({_id : fileInfo._id});
			callback(rs);
		});
	});
};

module.exports.deleteFileByFileName = function (filename, callback) {
	Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
		var gfs = Grid(db, mongo);

		// Here we use the filename property of the options structure
		gfs.remove({ filename: filename}, function (err) {
  			if (err) return handleError(err);
  			
  			callback('The file :' + filename +' is now gone');
		});
	});
};