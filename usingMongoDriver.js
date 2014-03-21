var config = require('./config.js').config;
var utils = require('./utils.js');
var mongo = require('mongodb');

// Let's pick some stuff out of Mongo for easier access
var Db = mongo.Db;
var Grid = mongo.Grid;
var GridStore = mongo.GridStore;

module.exports.storeSomeTextInGridFs = function (text, filename, key, callback) {
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
    grid.put(buffer, {metadata:{key:key}, filename : filename, content_type: 'text'}, function(err, fileInfo) {

      // If no errors
      if(!err) {
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
        // Ok, no error. Let's return the DATA, content of the file
        // as a string, to be nice...
        callback(data.toString());
      };
    });
  });
};

var deleteFile = function (id, callback) {
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
module.exports.deleteFile = deleteFile;

module.exports.removeAllFiles = function (callback) {
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    // This time around we will search for everyting and... then remove it
    db.collection("fs.files").findAndRemove({}, function (err, number) {
      if(err){ return console.dir(err); }
    });
  });
};

module.exports.unlinkFile = function (filename) {
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {
    GridStore.unlink(db, filename, function (err, fileinfo) {
      if(err) console.long(err);
    });
  });
};

module.exports.unlinkAllFiles = function () {
  Db.connect("mongodb://" + config.mongoDbUrl, function(err, db) {

    db.collection("fs.files").find({}).toArray(function (err, files) {

      var grid = new Grid(db, 'fs');
      for (var i = 0; i < files.length; i++) {
        var f = files[i];

        if(f){
          grid.delete(files[i]._id, function(err) {
            if(err) console.dir(err);
          });
        };
      };
    });
  });
};