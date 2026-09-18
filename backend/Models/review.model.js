const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

reviewSchema.index({ customer: 1, booking: 1 }, { unique: true }); // one review per booking

module.exports = mongoose.model('Review', reviewSchema);