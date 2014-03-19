var fs = require('fs');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var config = require('./config.js').config;
var utils = require('./utils.js');
var imgDir = "./img/";

// Remember that we had to connect to the db and
// then pass the db and the mongo as parameters
// when we created the gridsfs-stream.Grid?

// There's a simpler way... especially with Mongoose
// that just creates the connection once.
// First we can set the Mongo-property already up here,
// by just pulling it out of mongoose
Grid.mongo = mongoose.mongo;

// Secondly, the database parameter can be pulled from the mongoose connection
// We wrap this in a little function that returns the grid
var createGrid = function () {
	// We need to make sure that the connection is open.
	// and of course readyState 0 is Not open. What did you think?
	if(mongoose.connection.readyState === 0) {

		// Ok, not open yet.
		// lets open it
		mongoose.connect("mongodb://" + config.mongoDbUrl);
	}

	// Creating the grid is now easy
	// return Grid(mongoose.connection, Grid.mongo);

	// In fact... since we have set the Grid.mongo already
	// we could use a constructor that takes only the connection
	// like this:
	return Grid(mongoose.connection);
};


module.exports.storeFileFromDisk = function (filename, key, callback) {
	// Now we can create the gridfs-stream grid in one line
	var gfs = createGrid();

	// And in fact, the rest of the code is exactly the same
	// as before, in the usingGridFsStream.js
	// here we go, but with less comments
	var writestream = gfs.createWriteStream({
	    filename: filename,
	    metadata : { key : key }
	});

	var filePath = imgDir + filename;
	fs.createReadStream(filePath).pipe(writestream);

	// Let's for now just say that it worked
	callback('Dude, it worked!');
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