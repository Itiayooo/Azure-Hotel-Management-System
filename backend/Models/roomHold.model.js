const mongoose = require('mongoose');

const roomHoldSchema = new mongoose.Schema({
    physicalRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicalRoom', required: true },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    holderId: { type: String, required: true, index: true }, // random id made by the browser
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
});

// MongoDB deletes the document once expiresAt has passed
roomHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RoomHold', roomHoldSchema);