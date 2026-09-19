const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { getMyMessages, sendMessage, getAllThreads, getThreadByCustomer, replyToMessage } = require('../Controllers/message.controller.js');

router.get('/my', verifyToken, getMyMessages);
router.post('/', verifyToken, sendMessage);
router.get('/threads', verifyToken, verifyAdmin, getAllThreads);
router.get('/thread/:customerId', verifyToken, verifyAdmin, getThreadByCustomer);
router.post('/:customerId/reply', verifyToken, verifyAdmin, replyToMessage);

module.exports = router;