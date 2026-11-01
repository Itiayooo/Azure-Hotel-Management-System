const mongoose = require('mongoose');

const roomChangeSchema = new mongoose.Schema(
    {
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        reference: { type: String },
        guestName: { type: String },
        fromRoomNumber: { type: String, required: true },
        toRoomNumber: { type: String, required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedByName: { type: String },
        changedByRole: { type: String, enum: ['guest', 'admin'], required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RoomChange', roomChangeSchema);