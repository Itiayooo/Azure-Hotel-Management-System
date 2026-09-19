const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { getDashboardStats } = require('../Controllers/admin.controller.js');

router.get('/dashboard-stats', verifyToken, verifyAdmin, getDashboardStats);

module.exports = router;