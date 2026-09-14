const mongoose = require('mongoose');

const physicalRoomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        roomType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        status: {
            type: String,
            enum: ['available', 'occupied', 'maintenance'],
            default: 'available',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PhysicalRoom', physicalRoomSchema);