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
	// Note that we need to use the .createConnection-function
	// to get the connection object to hold on to
	// We need to make sure that the connection is open.
	// and of course readyState 0 is Not open. What did you think?
	if(mongoose.connection.readyState === 0) {

		// Ok, not open yet.
		// lets open it
		connection = mongoose.createConnection("mongodb://" + config.mongoDbUrl);
	};

	// Creating the grid is now easy
	// return Grid(connection.db, Grid.mongo);

	// In fact... since we have set the Grid.mongo already
	// we could use a constructor that takes only the connection
	// like this:
	return Grid(connection.db);
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
	// Here we go again...
	// create the grid, with our nifty little function
	var gfs = createGrid();

	// now we just pull the meta data from the
	// collection just like any old collection
	// which it's probably is.
	gfs.files.findOne({ metadata: {key : keySentIn} }, function (err, fileInfo) {
		if (err) console.log(err);
		callback(fileInfo);
	});
};
module.exports.getFileInfoByKeyInMetadata = getFileInfoByKeyInMetadata;


module.exports.streamFileForKey = function (key, callback) {
	// Let's first get the file meta data by key
	// with our function above
	getFileInfoByKeyInMetadata(key, function (fileInfo) {

		// Now it's the usual drill
		// Create grid... ah well you know this now
		var gfs = createGrid();

		// and now create a readstream and pass it back
		var rs = gfs.createReadStream({_id : fileInfo._id});
		callback(rs);
	});
};

module.exports.deleteFileByFileName = function (filename, callback) {
	var gfs = createGrid();

	// Here we use the filename property of the options structure
	gfs.remove({ filename: filename}, function (err) {
		if (err) return handleError(err);

		callback('The file :' + filename +' is now gone');
	});
};


module.exports.removeAllFiles = function () {
	var gfs = createGrid();

	gfs.files.find({ }, function (err, files) {
		if (err) console(err);

		if(files){
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				console.log("About to remove: " + files.filename);

				gfs.remove({ filename: files.filename}, function (err) {});
			}
		}
	});
};