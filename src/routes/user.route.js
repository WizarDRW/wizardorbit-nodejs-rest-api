const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
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

router.get('/', auth(Role.SuperUser), awaitHandlerFactory(userController.getAllUsers));
router.get('/urlgoogle', awaitHandlerFactory(googleAuth.getUrl));
router.get('/profile/:username', awaitHandlerFactory(userController.getUserProfile));
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById));
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByMail));
router.post('/', auth(Role.SuperUser), createUserSchema, awaitHandlerFactory(userController.create));
router.post('/resetPassword/:id', auth(), validateResetPassword, awaitHandlerFactory(userController.resetPassword));
router.put('/id/:id', auth(), updateUserSchema, awaitHandlerFactory(userController.updateUser));
router.put('/status/:id', auth(Role.SuperUser), validateStatus, awaitHandlerFactory(userController.updateUserStatus));
router.delete('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(userController.deleteUser));

module.exports = router;