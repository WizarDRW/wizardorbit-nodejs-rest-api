const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const { authLogger } = require('../utils/logger.utils');


const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            var user = await UserModel.findOne({ "_id": req.session.user_id });

            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }

            const ownerAuthorized = req.session.user_id == user._id;

            if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
                throw new HttpException(403, 'Unauthorized');
            }

            req.currentUser = user;

            next();
        } catch (err) {
            authLogger.warn(`${req.method} : ${req.originalUrl}`)
            authLogger.error(`${err.status} : ${err.message}`);
            next(err);
        }
    }
}

module.exports = auth;