// Routes/staff.routes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const { requireSuperAdmin } = require('../Middleware/access.js');
const {
    listStaff,
    getActivity,
    inviteStaff,
    updateStaff,
    setStaffActive,
    resendInvite,
} = require('../Controllers/staff.controller.js');

// Every route in this file is super admin only
router.use(verifyToken, requireSuperAdmin);

router.get('/', listStaff);
router.get('/activity', getActivity);
router.post('/', inviteStaff);
router.patch('/:id', updateStaff);
router.patch('/:id/active', setStaffActive);
router.post('/:id/resend-invite', resendInvite);

module.exports = router;