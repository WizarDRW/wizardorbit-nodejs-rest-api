const fs = require("fs")
const path = require('path')
const { uploadLogger } = require('./logger.utils')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */

class GoogleDriveService {

  uploads = async (body, contentid) => {
    const file = body;
    const finalPath = path.resolve(__dirname, `../uploads/${file.name}`);
    file.mv(finalPath, function (err, result) {
      if (err) {
        uploadLogger.error(`[file finalPath] : ${err}`)
        throw err;
      }
    })

    const drive = this.createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
      process.env.GOOGLE_DRIVE_ACCESS_TOKEN
    )

    const folder = await this.searchFolder(drive, contentid)
    if (!folder) {
      folder = await this.createFolder(drive, contentid, "SihirbazImage");
    }

    var result = await this.saveFile(drive, file.name, finalPath, file.mimetype, folder.id).catch((error) => {
      uploadLogger.error(`[saveFile] : ${error}`)
      console.error(error);
    });
    fs.unlinkSync(finalPath)
    return result.data.id;
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken, access_token) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken, access_token: access_token});

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder = async (driveClient, folderName, parentName) => {
    var folderid = await this.searchFolder(driveClient, parentName);
    return driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: folderid.id
      },
      fields: 'id, name',
    });
  }

  searchFolder = async (driveClient, folderName) => {
    return new Promise((resolve, reject) => {
      driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res) => {
          if (err) {
            uploadLogger.error(`[searchFolder] : ${err}`)
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(driveClient, fileName, filePath, fileMimeType, folderId) {
    return driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
        fields: 'id'
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }

  deleteFile(fileid) {
    const drive = this.createDriveClient(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI,
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
      process.env.GOOGLE_DRIVE_ACCESS_TOKEN
    );
    uploadLogger.warn(`[deleteFile] : ${fileid}`)
    return drive.files.delete({ fileId: fileid });
  }
}

module.exports = new GoogleDriveService;