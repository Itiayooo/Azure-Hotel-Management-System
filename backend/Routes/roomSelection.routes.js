const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const {
    getRoomMap,
    holdRoom,
    releaseHold,
    changeRoom,
    getRoomChanges,
} = require('../Controllers/roomSelection.controller.js');

// Public: guests pick a room during checkout, with or without an account
router.get('/map', getRoomMap);
router.post('/hold', holdRoom);
router.delete('/hold/:holderId', releaseHold);

// Logged in: a guest changing their own booking, or an admin reassigning
router.patch('/change-room/:bookingId', verifyToken, loadAccount, changeRoom);
router.get('/changes', verifyToken, requirePermission('bookings.view'), getRoomChanges);

module.exports = router;