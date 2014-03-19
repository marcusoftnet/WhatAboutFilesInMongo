var fs = require("fs");
var should = require("should");
var utils = require("../utils.js");
var fsAccess = require("../usingGridFsStream.js");

describe("GridFs-Stream is a nicer way to handle GridFs IMHO", function () {
	var A_KEY = "a_key_to_retrive_the_file_by";
	var FILE_NAME = "a.gif";
	var OUTPUT_FILE_PATH = './img/b.gif';

	beforeEach(function (done) {
		utils.deleteFromDisk(OUTPUT_FILE_PATH);
		done();
	});

	afterEach(function (done) {
		utils.deleteFromDisk(OUTPUT_FILE_PATH);
		utils.removeAllFiles();
		done();
	});

	it("to can store files", function (done) {
		fsAccess.storeFileFromDisk(FILE_NAME, A_KEY, function (result) {
			result.should.containEql("worked");
			result.should.containEql("Dude");
			done();
		});
	});
	it("can get files by metadata", function (done) {
		fsAccess.storeFileFromDisk(FILE_NAME, A_KEY, function (result) {
			fsAccess.getFileInfoByKeyInMetadata(A_KEY, function (fileInfo) {
				should.exists(fileInfo);
				fileInfo.filename.should.eql(FILE_NAME);
				done();
			});
		});
	});
	it("the actual file can also be retrieved... or streamed rather", function (done) {
		fsAccess.storeFileFromDisk(FILE_NAME, A_KEY, function (result) {
			fsAccess.streamFileForKey(A_KEY, function (fileReadStream) {
				should.exists(fileReadStream);

				var ws = fs.createWriteStream(OUTPUT_FILE_PATH);
				fileReadStream.pipe(ws);
				fs.existsSync(OUTPUT_FILE_PATH).should.eql(true);
				done();
			});
		});
	});
	it("can delete files using filename", function (done) {
		fsAccess.storeFileFromDisk(FILE_NAME, A_KEY, function (result) {
			fsAccess.deleteFileByFileName(FILE_NAME, function (result) {
				result.should.containEql(FILE_NAME);
				result.should.containEql('gone');
				done();
			});
		});
	});
});