var should = require("should");
var utils = require("../utils.js");
var config = require('../config.js').config;
var fsAccess = require("../usingMongooseGridFs.js");

describe("Hey granpa, I'm not using the default MongoDb driver anymore...I'm using Mongoose... so what do I do now?", function () {

	var A_KEY = "";
	var OUTPUT_FILE_PATH = './img/b.gif';

	beforeEach(function (done) {
		A_KEY = utils.GetTestKey();
		utils.deleteFileFromDisk(OUTPUT_FILE_PATH);
		done();
	});

	afterEach(function (done) {
		utils.removeAllFiles();
		done();
	});

	it("well... Mongoose exposes some nice properties", function (done) {
		var mongoose = require('mongoose');
		mongoose.connect("mongodb://" + config.mongoDbUrl);

		should.exists(mongoose.mongo);
		should.exists(mongoose.connection);
		done();
	});
	it("using those properites, it's easy to store files", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			result.should.containEql("worked");
			result.should.containEql("Dude");
			done();
		});
	});
	it("and read file metadata back, of course", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			fsAccess.getFileInfoByKeyInMetadata(A_KEY, function (fileInfo) {
				should.exists(fileInfo);
				fileInfo.filename.should.eql(utils.TEST_FILENAME);
				done();
			});
		});
	});
	it("and ... yawn ... streaming", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			fsAccess.streamFileForKey(A_KEY, function (fileReadStream) {
				should.exists(fileReadStream);

				var ws = fs.createWriteStream(OUTPUT_FILE_PATH);
				fileReadStream.pipe(ws);
				fs.existsSync(OUTPUT_FILE_PATH).should.eql(true);
				done();
			});
		});
	});

	it("and delete them too, just as before", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			fsAccess.deleteFileByFileName(utils.TEST_FILENAME, function (result) {
				result.should.containEql(utils.TEST_FILENAME);
				result.should.containEql('gone');
				done();
			});
		});
	});

	describe("But... that's not really any difference at all?", function () {
		it("No, it's just simpler to create the gridfs-stream object, from the mongoose properties", function (done) {
			"Yes".should.eql("Yes");
			done();
		})
	})
});
