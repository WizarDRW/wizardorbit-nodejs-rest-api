const express = require('express');
const router = express.Router();
const controller = require('../controllers/news.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.get('/', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.getAll)); // localhost:3000/api/v1/users
router.get('/client', awaitHandlerFactory(controller.getPublishedAll)); // localhost:3000/api/v1/users
router.get('/find/:text', awaitHandlerFactory(controller.getFindAll)); // localhost:3000/api/v1/users
router.get('/top/:count', awaitHandlerFactory(controller.getAllTop)); // localhost:3000/api/v1/users
router.get('/id/:id', awaitHandlerFactory(controller.getById)); // localhost:3000/api/v1/users/id/1
router.get('/userid/:user_id', awaitHandlerFactory(controller.getByUserId)); // localhost:3000/api/v1/users/usersname/julia
router.get('/client/userid/:user_id', awaitHandlerFactory(controller.getByUserPublishedAll));
router.post('/', auth(), awaitHandlerFactory(controller.create)); // localhost:3000/api/v1/users
router.put('/id/:id', auth(), awaitHandlerFactory(controller.update)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.put('/updateImpression/id/:id', awaitHandlerFactory(controller.updateImpression)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin, Role.SuperUser), awaitHandlerFactory(controller.delete)); // localhost:3000/api/v1/users/id/1

module.exports = router;