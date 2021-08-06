const { google } = require("googleapis")
const urlParser = require("url-parse")
const queryParse = require("query-string")
const bodyParser = require("body-parser")
const axios = require("axios")
const request = require("request")

class GoogleAuthProcess {
  getUrl(req, res, next) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    )
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: JSON.stringify({
        callbackUrl: req.body.callbackUrl,
        userID: req.body.userId
      })
    })
    request(url, (err, response, body) => {
      res.send({ url })
    })
  }
  async googleToken(req, res, next) {
    console.log(req.body);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    )
    const tokens = await oauth2Client.getToken(req.body.code)
    try {
      const result = await axios({
        method: "POST",
        headers: {
          authorization: "Bearer " + tokens.tokens.access_token
        },
        "Content-Type": "application/json",
        url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        data: {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }
          ],
          bucketByTime: {durationMillis: 86400000},
          startTimeMills: 1585785599000,
          endTimeMills: 1585785599000,
        }
      })
      console.log(result);
      var arr = result.data.bucket
      console.log(arr);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new GoogleAuthProcess;