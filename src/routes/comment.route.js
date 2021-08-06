const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { validate } = require('../middleware/validators/commentValidator.middleware');


router.get('/', awaitHandlerFactory(controller.getAll)); // localhost:3000/api/v1/users
router.get('/top/:count', awaitHandlerFactory(controller.getAll)); // localhost:3000/api/v1/users
router.get('/id/:id', awaitHandlerFactory(controller.getById)); // localhost:3000/api/v1/users/id/1
router.post('/', auth(Role.Admin), validate, awaitHandlerFactory(controller.create)); // localhost:3000/api/v1/users
router.put('/id/:id', auth(Role.Admin), validate, awaitHandlerFactory(controller.update)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(controller.delete)); // localhost:3000/api/v1/users/id/1

module.exports = router;