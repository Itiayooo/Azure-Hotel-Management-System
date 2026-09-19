const express = require('express');
const router = express.Router();
const optionalAuth = require('../Middleware/optionalAuth.js');
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { sendReceiptEmail } = require('../Controllers/booking.controller.js');

const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    verifyBooking,
    cancelBooking,
} = require('../Controllers/booking.controller.js');

const { confirmBooking, checkInBooking, checkOutBooking } = require('../Controllers/booking.controller.js');

router.post('/', optionalAuth, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.get('/', verifyToken, verifyAdmin, getAllBookings);
router.get('/verify/:reference', verifyBooking);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);
router.post('/send-receipt-email', sendReceiptEmail);
router.patch('/:id/confirm', verifyToken, verifyAdmin, confirmBooking);
router.patch('/:id/check-in', verifyToken, verifyAdmin, checkInBooking);
router.patch('/:id/check-out', verifyToken, verifyAdmin, checkOutBooking);

module.exports = router;