const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.get('/', awaitHandlerFactory(aboutController.getAll));
router.get('/type/:type', awaitHandlerFactory(aboutController.getByType));
router.get('/releases', awaitHandlerFactory(aboutController.getReleases));
router.get('/id/:id',auth(Role.SuperUser), awaitHandlerFactory(aboutController.getById));
router.get('/release/:id',auth(Role.SuperUser), awaitHandlerFactory(aboutController.getReleaseById));
router.post('/', auth(Role.SuperUser), awaitHandlerFactory(aboutController.create));
router.put('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(aboutController.update));
router.delete('/id/:id', auth(Role.SuperUser), awaitHandlerFactory(aboutController.delete));

module.exports = router;