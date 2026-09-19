const Testimonial = require('../Models/testimonial.model.js');
const Booking = require('../Models/booking.model.js');
const User = require('../Models/user.model.js');


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

const getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
    }
};

const getMyTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ customer: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your testimonials', error: error.message });
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
    }
};

const approveTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve testimonial', error: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
    }
};

module.exports = {
    createTestimonial,
    getApprovedTestimonials,
    getMyTestimonials,
    getAllTestimonials,
    approveTestimonial,
    deleteTestimonial
};