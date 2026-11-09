const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { requirePermission, loadAccount } = require('../Middleware/access.js');
const { getDashboardStats, getBookingStats, getNotificationSummary, markTasksViewed, reconcileRoomStatuses } = require('../Controllers/admin.controller.js');

router.get('/dashboard-stats', verifyToken, requirePermission('dashboard'), getDashboardStats);
router.get('/booking-stats', verifyToken, requirePermission('dashboard'), getBookingStats);
router.get('/notifications', verifyToken, requirePermission(), getNotificationSummary);
router.patch('/notifications/tasks-viewed', verifyToken, requirePermission('tasks'), markTasksViewed);
router.post('/reconcile-rooms', verifyToken, verifyAdmin, reconcileRoomStatuses);

module.exports = router;