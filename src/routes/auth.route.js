const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const googleAuth = require("../utils/googleAuth.util")
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const {
    createUserSchema,
    updateUserSchema,
    validateLogin,
    validateResetPassword,
    validateStatus
} = require('../middleware/validators/userValidator.middleware');


/**
 * GET /api/v1/auth/verify
 * @tags auth
 * @security BasicAuth
 * @summary This is the summary of the endpoint
 * @return {object} 200 - true
 * @example response - 200 - success response example
 * true
 */
router.get('/verify', auth(), awaitHandlerFactory(controller.verify));
/**
 * POST /api/v1/auth/register
 * @tags auth
 * @summary This is the summary of the endpoint
 * @param {RegisterDto} request.body.required - login info
 * @return {object} 200 - true
 * @example response - 200 - success response example
 * true
 */
router.post('/register', createUserSchema, awaitHandlerFactory(controller.register));
router.post('/google_token', validateLogin, awaitHandlerFactory(googleAuth.googleToken));
router.get('/login', controller.login)
/**
 * POST /api/v1/auth/dologin
 * @tags auth
 * @summary This is the summary of the endpoint
 * @param {LoginDto} request.body.required - login info
 * @return {object} 200 - true
 * @example response - 200 - success response example
 * true
 */
router.post('/dologin', validateLogin, awaitHandlerFactory(controller.doLogin));

/**
 * POST /api/v1/auth/destroysession
 * @tags auth
 * @security BasicAuth
 * @summary This is the summary of the endpoint
 * @return {object} 200 - true
 * @example response - 200 - success response example
 * true
 */
router.post('/destroysession', auth(), (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.status(200).send(true);
    })
});


module.exports = router;