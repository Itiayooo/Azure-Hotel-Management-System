const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const { createContactMessage, getAllContactMessages } = require('../Controllers/contact.controller.js');

router.post('/', createContactMessage);
router.get('/', verifyToken, getAllContactMessages); // tighten to admin-only once isAdmin exists

module.exports = router;