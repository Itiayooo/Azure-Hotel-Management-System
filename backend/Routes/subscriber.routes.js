const express = require('express');
const router = express.Router();
const { subscribe } = require('../Controllers/subscriber.controller.js');

router.post('/', subscribe);

module.exports = router;