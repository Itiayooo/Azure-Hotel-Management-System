const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { getDashboardStats, getBookingStats } = require('../Controllers/admin.controller.js');

router.get('/booking-stats', verifyToken, verifyAdmin, getBookingStats);

module.exports = router;