// Routes/booking.routes.js
const express = require('express');
const router = express.Router();
const optionalAuth = require('../Middleware/optionalAuth.js');
const verifyToken = require('../Middleware/verifyToken.js');
const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    cancelBooking,
} = require('../Controllers/booking.controller.js');

router.post('/', optionalAuth, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.get('/', verifyToken, getAllBookings); // admin-only 
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;