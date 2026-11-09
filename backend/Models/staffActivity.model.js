const mongoose = require('mongoose');

const staffActivitySchema = new mongoose.Schema(
    {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        actorName: { type: String },
        action: {
            type: String,
            enum: ['invited', 'updated', 'deactivated', 'reactivated', 'invite-resent'],
            required: true,
        },
        targetName: { type: String },
        targetEmail: { type: String },
        details: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('StaffActivity', staffActivitySchema);