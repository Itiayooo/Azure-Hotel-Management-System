const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const {
    createTestimonial,
    getApprovedTestimonials,
    getMyTestimonials,
    getAllTestimonials,
    approveTestimonial,
    deleteTestimonial,
} = require('../Controllers/testimonial.controller.js');

router.get('/', getApprovedTestimonials);
router.post('/', verifyToken, createTestimonial);
router.get('/my', verifyToken, getMyTestimonials);
router.get('/all', verifyToken, verifyAdmin, getAllTestimonials);
router.patch('/:id/approve', verifyToken, verifyAdmin, approveTestimonial);
router.delete('/:id', verifyToken, verifyAdmin, deleteTestimonial);

module.exports = router;