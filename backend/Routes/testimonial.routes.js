const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const {
    createTestimonial,
    getApprovedTestimonials,
    getMyTestimonials,
} = require('../Controllers/testimonial.controller.js');

router.get('/', getApprovedTestimonials);
router.post('/', verifyToken, createTestimonial);
router.get('/my', verifyToken, getMyTestimonials);

module.exports = router;