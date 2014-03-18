var should = require("should");
var fsAccessor = require("../mongodriver.js");
var utils = require("../utils.js");

describe("The Mongo driver has a api to the GridFs", function () {
	var A_KEY = "a_key_to_retrive_the_file_by";
	var FILE_NAME = "a.gif";

	it("can store text as a file (why I really don't know...)", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			should.exists(fileInfo);
			fileInfo._id.should.not.be.empty;
			done();
		});
	});

	it("can get it back out again...", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			fsAccessor.getFileById(fileInfo._id, function(textFromFile) {
				should.exists(textFromFile);
				textFromFile.should.eql("The text I want to store");
				done();
			});
		});
	});

	it("can be deleted too", function (done) {
		fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
			fsAccessor.deleteFile(fileInfo._id, function (err) {
				should.not.exists(err);
				done();
				console.log("Yeah... it's now gone. Since we got here with no errors");
			});
		});
	});

	describe("A nicer API for files is thankfully present", function () {
		it("but sadly it didn't work for me and threw strange errors about deprecated methods that I didn't call...", function (done) {
			fsAccessor.storeFileFromDisk(FILE_NAME, A_KEY, function (fileInfo) {
				should.exists(fileInfo);
				fileInfo.filename.should.eql(FILE_NAME);
				done();
			});
		});
		// it("can be queried on the meta data, so that we don't need to care about the _id", function (done) {
		// 	fsAccessor.storeSomeTextInGridFs("The text I want to store", A_KEY, function (fileInfo) {
		// 		fsAccessor.getFileByMetadata(A_KEY, function(textFromFile) {
		// 			should.exists(textFromFile);
		// 			textFromFile.should.eql("The text I want to store");
		// 			done();
		// 		});
		// 	});
		// });

		// it("is a bit messy to store a from disk", function (done) {
		// 	fsAccessor.storeFileAlreadyOnDiskInGridFs(FILE_NAME, A_KEY, function (fileInfo) {
		// 		console.log(fileInfo);
		// 		done();
		// 	});
		// });
	});


	it("Luckily there's a blog post that explains all of this", function (done) {
		done();
		console.dir("http://blog.nodeknockout.com/post/35215400231/a-primer-for-gridfs-using-the-mongo-db-driver");
	});
});