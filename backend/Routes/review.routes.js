const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const { createReview, getReviewsForRoom } = require('../Controllers/review.controller.js');

router.post('/', verifyToken, createReview);
router.get('/room/:roomId', getReviewsForRoom);

module.exports = router;