const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const { getMyMessages, sendMessage } = require('../Controllers/message.controller.js');

router.get('/my', verifyToken, getMyMessages);
router.post('/', verifyToken, sendMessage);

module.exports = router;