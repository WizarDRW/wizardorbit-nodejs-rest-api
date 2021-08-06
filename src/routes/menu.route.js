const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { validateMenu } = require('../middleware/validators/menuValidator.middleware');


router.get('/', awaitHandlerFactory(menuController.getAll)); // localhost:3000/api/v1/users
router.get('/id/:id', awaitHandlerFactory(menuController.getById)); // localhost:3000/api/v1/users/id/1
router.post('/', auth(Role.Admin), validateMenu, awaitHandlerFactory(menuController.create)); // localhost:3000/api/v1/users
router.put('/id/:id', auth(Role.Admin), validateMenu, awaitHandlerFactory(menuController.update)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(menuController.delete)); // localhost:3000/api/v1/users/id/1

module.exports = router;