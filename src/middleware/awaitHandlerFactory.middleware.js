// const {serverLogger} = require('../utils/logger.utils');
const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            // if (req.originalUrl != "/api/v1/users/verify/" && req.originalUrl != "/api/v1/users/whoami/") 
            // serverLogger.info(`${req.method} : ${req.originalUrl}`)
            await middleware(req, res, next)
        } catch (err) {
            // serverLogger.error(`${err}`)
            next(err)
        }
    }
}

module.exports = awaitHandlerFactory;