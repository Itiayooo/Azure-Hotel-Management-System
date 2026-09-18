const Review = require('../Models/review.model.js');
const Booking = require('../Models/booking.model.js');
const Room = require('../Models/room.model.js');

const recalculateRoomRating = async (roomTypeId) => {
    const reviews = await Review.find({ roomType: roomTypeId });
    const numReviews = reviews.length;
    const rating = numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    await Room.findByIdAndUpdate(roomTypeId, {
        rating: Math.round(rating * 10) / 10,
        numReviews,
    });
};

const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        const booking = await Booking.findOne({
            _id: bookingId,
            customer: req.user.id,
            status: 'confirmed', // temporary, same as testimonials — tighten to 'checked-out' later
        });

        if (!booking) {
            return res.status(403).json({ message: 'No eligible booking found for review' });
        }

        const review = await Review.create({
            customer: req.user.id,
            roomType: booking.roomType,
            booking: bookingId,
            rating,
            comment,
        });

        await recalculateRoomRating(booking.roomType);

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You already reviewed this booking' });
        }
        res.status(400).json({ message: 'Failed to submit review', error: error.message });
    }
};


const getReviewsForRoom = async (req, res) => {
    try {
        const reviews = await Review.find({ roomType: req.params.roomId })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

module.exports = { createReview, getReviewsForRoom };