var fs = require("fs");
var should = require("should");
var utils = require("../utils.js");
var fsAccess = require("../usingGridFsStream.js");

describe("GridFs-Stream is a nicer way to handle GridFs IMHO", function () {
	var A_KEY = "a_key_to_retrive_the_file_by";
	var OUTPUT_FILE_PATH = './img/b.gif';

	beforeEach(function (done) {
		utils.deleteFileFromDisk(OUTPUT_FILE_PATH);
		done();
	});

	afterEach(function (done) {
		utils.deleteFileFromDisk(OUTPUT_FILE_PATH);
		utils.removeAllFiles();
		done();
	});

	it("it too can store files", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			result.should.containEql("worked");
			result.should.containEql("Dude");
			done();
		});
	});
	it("and it can get files by metadata", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			fsAccess.getFileInfoByKeyInMetadata(A_KEY, function (fileInfo) {
				should.exists(fileInfo);
				fileInfo.filename.should.eql(utils.TEST_FILENAME);
				done();
			});
		});
	});
	it("and of course, the actual file can also be retrieved... or streamed rather", function (done) {
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
	it("Finally, gridfs-stream can delete files using filename, or other properties", function (done) {
		fsAccess.storeFileFromDisk(utils.TEST_FILENAME, A_KEY, function (result) {
			fsAccess.deleteFileByFileName(utils.TEST_FILENAME, function (result) {
				result.should.containEql(utils.TEST_FILENAME);
				result.should.containEql('gone');
				done();
			});
		});
	});
});