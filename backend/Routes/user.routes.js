const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const { updateProfile } = require('../Controllers/user.controller.js');

router.put('/profile', verifyToken, updateProfile);

module.exports = router;