const express = require('express');
const router = express.Router();
const controller = require('../controllers/draft.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.get('/', auth(Role.SuperUser), awaitHandlerFactory(controller.getAll));
router.get('/id/:id', auth(), awaitHandlerFactory(controller.getById));
router.get('/userid/:user_id', auth(), awaitHandlerFactory(controller.getByUserId));
router.post('/', auth(), awaitHandlerFactory(controller.create));
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update));
router.delete('/id/:id', auth(), awaitHandlerFactory(controller.delete));

module.exports = router;