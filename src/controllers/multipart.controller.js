const googleDriveService = require("../utils/googledrive.utils.js");
var urlParser = require('url-parse');

class MultipartController {
    uploadImage = async (req, res, next) => {
        var result = await googleDriveService.uploads(req.files.photo, req.currentUser._id);
        res.send(result)
    }

    deleteImage = async (req, res, next) => {
        var url = new urlParser(req.body.url, true);
        var result = await googleDriveService.deleteFile(url.query.id);
        res.send(result)
    }
}

module.exports = new MultipartController;