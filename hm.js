var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert'),
    fs = require("fs");

var db = new Db('test', new Server('locahost', 27017));
// Establish connection to db
db.open(function(err, db) {
  // Our file ID
  var fileId = new ObjectID();

  // Open a new file
  var gridStore = new GridStore(db, fileId, 'w');

  // Read the filesize of file on disk (provide your own)
  var fileSize = fs.statSync('./a.gif').size;
  // Read the buffered data for comparision reasons
  var data = fs.readFileSync('./a.gif');

  // Open the new file
  gridStore.open(function(err, gridStore) {

    // Write the file to gridFS
    gridStore.writeFile('./a.gif', function(err, doc) {

      // Read back all the written content and verify the correctness
      GridStore.read(db, fileId, function(err, fileData) {
        assert.equal(data.toString('base64'), fileData.toString('base64'))
        assert.equal(fileSize, fileData.length);

        db.close();
      });
    });
  });
});