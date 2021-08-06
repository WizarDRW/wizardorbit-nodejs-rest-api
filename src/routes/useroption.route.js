const express = require('express');
const router = express.Router();
const controller = require('../controllers/useroption.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { validateMenu } = require('../middleware/validators/userOptionValidator.middleware');

router.get('/', auth(Role.SuperUser), awaitHandlerFactory(controller.getAll));
router.get('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.getById));
router.get('/userid/:userid', auth(), awaitHandlerFactory(controller.getByUserId));
router.get('/theme/:userid', auth(), awaitHandlerFactory(controller.getByUserTheme));
router.post('/', auth(Role.SuperUser), awaitHandlerFactory(controller.create));
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update));
router.delete('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;