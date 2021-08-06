const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.get('/', auth(Role.SuperUser), awaitHandlerFactory(controller.getAll));
router.get('/id/:id', awaitHandlerFactory(controller.getById));
router.get('/type/:type', awaitHandlerFactory(controller.getByType));
router.post('/', auth(Role.SuperUser), awaitHandlerFactory(controller.create));
router.put('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.update));
router.delete('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;