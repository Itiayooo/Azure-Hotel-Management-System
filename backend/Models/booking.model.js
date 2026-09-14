const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        roomType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        physicalRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PhysicalRoom',
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'checked-in', 'checked-out'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentReference: {
            type: String,
        },
        guestDetails: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);