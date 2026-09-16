const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            required: true,
            maxlength: 500,
        },
        avatar: {
            type: String,
            default: '',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);