const express = require('express');
const router = express.Router();
const optionalAuth = require('../Middleware/optionalAuth.js');
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { requirePermission, loadAccount } = require('../Middleware/access.js')
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
router.post('/send-receipt-email', sendReceiptEmail);
router.get('/', verifyToken, requirePermission('bookings.view', 'dashboard'), getAllBookings);
router.patch('/:id/cancel', verifyToken, loadAccount, cancelBooking);
router.patch('/:id/confirm', verifyToken, requirePermission('bookings.manage'), confirmBooking);
router.patch('/:id/check-in', verifyToken, requirePermission('bookings.manage'), checkInBooking);
router.patch('/:id/check-out', verifyToken, requirePermission('bookings.manage'), checkOutBooking);

module.exports = router;