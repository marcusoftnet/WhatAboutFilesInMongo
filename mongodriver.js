var config = require('./config.js').config;
var utils = require('./utils.js');
var mongo = require('mongodb');

// Let's pick some stuff out of Mongo for easier access
var Db = mongo.Db;
var Grid = mongo.Grid;

module.exports.storeSomeTextInGridFs = function (text, key, callback) {
  // We need to connect to the database first
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    // Check for errors and bail
    if(err){ return console.dir(err); }

    // Create a Buffer of the text we sent in...
    // I absolutely hate buffers and streams but
    var buffer = new Buffer(text);

    // we create a new instance of the grid (as in MongoGrid)
    // the second parameter ("fs"), is the name of the collection
    // or rather the prefix since Mongo stores the file in one
    // fs_files collection and one fs_chunks collection.
    // luckily we don't have to care much about that...
    // we just use the grid, but remembers to set the "fs"-parameter
    var grid = new Grid(db, 'fs');

    // And that let's us "put" the Buffer...
    // a bit low level if you ask me...
    grid.put(buffer, {metadata:{key:key}, content_type: 'text'}, function(err, fileInfo) {

      // If no errors
      if(!err) {
        console.log("Finished writing file to Mongo");

        // Ok, no error. Let's return the whole thing
        callback(fileInfo);
      };
    });
  });
};

module.exports.getFileById = function (id, callback ) {
  // Open the db
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    // Check for errors and bail
    if(err){ return console.dir(err); }

    // Create the grid again
    var grid = new Grid(db, 'fs');

    // Now we can get the DATA of the file
    // and it follows the same pattern as "putting" above
    grid.get(id, function(err, data) {
      // If no errors
      if(!err) {
        console.log("Got the file from Mongo");

        // Ok, no error. Let's return the DATA, content of the file
        // as a string, to be nice...
        callback(data.toString());
      };
    });
  });
};

module.exports.deleteFile = function (id, callback) {
  // Open the ... bah - I'll start leaving obvious comments out
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    if(err){ return console.dir(err); }

    var grid = new Grid(db, 'fs');

    // Now we can get delete the file
    // which obviously don't gives any data,
    // only errors if they happend
    grid.delete(id, function(err) {
      // Let's just return the error (if any) back out
      callback(err);
    });
  });
};

module.exports.storeFileFromDisk = function (filePath, key, callback) {
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    if(err){ return console.dir(err); }

    // Now, let's read the file
    fs.readFile(filePath, function (err, filedata) {
      // Create the grid
      var grid = new Grid(db, 'fs');

      // and put the file data
      // probably best convert it to a buffer...
      // I really don't understand why I should have to think about this.
      var buffer = new Buffer(filedata);

      // remember to set the content type
      grid.put(buffer, {metadata:{key:key}, content_type: 'image'}, function(err, fileInfo) {

      // If no errors
      if(!err) {
        console.log("Finished writing file to Mongo");

        // Ok, no error. Let's return the whole thing
        callback(fileInfo);
      };
    });
  });
};