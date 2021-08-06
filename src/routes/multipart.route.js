const express = require('express');
const router = express.Router();
const controller = require('../controllers/multipart.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/upload', auth(), awaitHandlerFactory(controller.uploadImage));
router.post('/delete-image', auth(), awaitHandlerFactory(controller.deleteImage));

module.exports = router;