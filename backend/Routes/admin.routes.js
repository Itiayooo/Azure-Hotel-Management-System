const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { getDashboardStats, getBookingStats, getNotificationSummary, markTasksViewed } = require('../Controllers/admin.controller.js');

router.get('/dashboard-stats', verifyToken, verifyAdmin, getDashboardStats);
router.get('/booking-stats', verifyToken, verifyAdmin, getBookingStats);
router.get('/notifications', verifyToken, verifyAdmin, getNotificationSummary);
router.patch('/notifications/tasks-viewed', verifyToken, verifyAdmin, markTasksViewed);

module.exports = router;