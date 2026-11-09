const express = require('express');
const router = express.Router();
const { register, login, googleLogin, forgotPassword, resetPassword, getMe } = require('../Controllers/auth.controller.js');
const verifyToken = require('../Middleware/verifyToken.js')

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getMe);

module.exports = router;