var should = require("should");
var utils = require("../utils.js");
var config = require('../config.js').config;
var fsAccessor = require("../usingMongooseGridFs.js");

describe("Hey granpa, I'm not using the default MongoDb driver anymore...I'm using Mongoose... so what do I do now?", function () {

	var A_KEY = "a_key_to_retrive_the_file_by";
	var FILE_NAME = "a.gif";
	var OUTPUT_FILE_PATH = './img/b.gif';

	beforeEach(function (done) {
		utils.deleteFromDisk(OUTPUT_FILE_PATH);
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
	it("using those properites, it's easy to store files");
	it("and read files back");
	it("and delete them too, just as before");
});
