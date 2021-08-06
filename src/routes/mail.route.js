const express = require('express');
const router = express.Router();
const menuController = require('../controllers/mail.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.post('/sendmail', awaitHandlerFactory(menuController.sendMail));

module.exports = router;