const express = require('express');
const router = express.Router();
const controller = require('../controllers/library.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { validateLibrary } = require('../middleware/validators/libraryValidator.middleware');

router.get('/', awaitHandlerFactory(controller.getAll));
router.get('/id/:id', awaitHandlerFactory(controller.getById));
router.get('/userid/:user_id', awaitHandlerFactory(controller.getByUserId));
router.post('/', auth(), validateLibrary, awaitHandlerFactory(controller.create));
router.post('/upload', awaitHandlerFactory(controller.uploadImage));
router.put('/id/:id', auth(), validateLibrary, awaitHandlerFactory(controller.update));
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;