var should = require("should");
var fsAccessor = require("../mongodriver.js");
var utils = require("../utils.js");

describe("The Mongo driver has a api to the GridFs", function () {
	var A_KEY = "a_key_to_retrive_the_file_by";

	afterEach(function (done) {
		utils.removeAllFiles(); 
		done();
	});

	it("that can store text as a file (why I really don't know...)", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			should.exists(fileInfo);
			fileInfo._id.should.not.be.empty;
			done();
		});
	});

	it("and can get it back out again...", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			fsAccessor.getFileById(fileInfo._id, function(textFromFile) {
				should.exists(textFromFile);
				textFromFile.should.eql("The text I want to store");
				done();
			});
		});
	});

	it("and can deleted things too", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			fsAccessor.deleteFile(fileInfo._id, function (err) {
				should.not.exists(err);
				done();
			});
		});
	});

	describe("A nicer API for files is thankfully present, with methods like writeFile(filepath) for example", function () {
		it("but sadly it didn't work for me and threw strange errors about deprecated methods that I didn't call...", function (done) {
			done();
		});
	});

	it("Luckily there's a blog post that explains all of this\n\t-http://blog.nodeknockout.com/post/35215400231/a-primer-for-gridfs-using-the-mongo-db-driver", function (done) {
		done();
	});
});