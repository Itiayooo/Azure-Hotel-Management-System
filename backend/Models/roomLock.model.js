const mongoose = require('mongoose');

const roomLockSchema = new mongoose.Schema({
    physicalRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PhysicalRoom',
        required: true,
        unique: true,
    },
    createdAt: { type: Date, default: Date.now, expires: 20 },
});

module.exports = mongoose.model('RoomLock', roomLockSchema);