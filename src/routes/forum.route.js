const express = require('express');
const router = express.Router();
const controller = require('../controllers/forum.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createValidateForum, updateValidateForum } = require('../middleware/validators/forumValidator.middleware');

router.get('/', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.getAll));
router.get('/client', awaitHandlerFactory(controller.getPublishedAll));
router.get('/find/:text', awaitHandlerFactory(controller.getFindAll));
router.get('/top/:count', awaitHandlerFactory(controller.getAllTop));
router.get('/id/:id', awaitHandlerFactory(controller.getById));
router.get('/userid/:user_id', auth(), awaitHandlerFactory(controller.getByUserId));
router.get('/client/userid/:user_id', awaitHandlerFactory(controller.getByUserPublishedAll));
router.post('/', auth(), createValidateForum, awaitHandlerFactory(controller.create));
router.post('/comment/:id', auth(), awaitHandlerFactory(controller.createComment));
router.put('/id/:id', auth(), updateValidateForum, awaitHandlerFactory(controller.update));
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression));
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete));

module.exports = router;