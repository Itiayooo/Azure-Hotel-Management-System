const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sender: { type: String, enum: ['customer', 'admin'], required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);