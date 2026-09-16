const Testimonial = require('../Models/testimonial.model.js');
const Booking = require('../Models/booking.model.js');
const User = require('../Models/user.model.js');

// POST /api/testimonials
const createTestimonial = async (req, res) => {
    try {
        const { role, location, message } = req.body;

        const hasEligibleBooking = await Booking.findOne({
            customer: req.user.id,
            status: 'confirmed',
        });

        if (!hasEligibleBooking) {
            return res.status(403).json({ message: 'You need a completed stay to leave a testimonial' });
        }

        const user = await User.findById(req.user.id);

        const testimonial = await Testimonial.create({
            customer: req.user.id,
            name: user.name,
            role,
            location,
            message,
        });

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: 'Failed to submit testimonial', error: error.message });
    }
};

// GET /api/testimonials (public — approved only)
const getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
    }
};

// GET /api/testimonials/my
const getMyTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ customer: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your testimonials', error: error.message });
    }
};

module.exports = {
    createTestimonial,
    getApprovedTestimonials,
    getMyTestimonials,
};