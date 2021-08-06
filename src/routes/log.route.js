const express = require('express');
const router = express.Router();
const controller = require('../controllers/log.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.get('/', auth(), awaitHandlerFactory(controller.getAll));
router.get('/id/:id', awaitHandlerFactory(controller.getById));
router.get('/userid/:user_id', awaitHandlerFactory(controller.getByUserId));
router.post('/', auth(), awaitHandlerFactory(controller.create));
router.post('/upload', awaitHandlerFactory(controller.uploadImage));
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update));
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(controller.delete));

module.exports = router;