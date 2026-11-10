const crypto = require('crypto');
const User = require('../Models/user.model.js');
const StaffActivity = require('../Models/staffActivity.model.js');
const sendEmail = require('../Utils/sendEmail.js');
const { PERMISSION_KEYS } = require('../Utils/permissions.js');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://grandazure.vercel.app';
const INVITE_HOURS = 48;
const ASSIGNABLE_ROLES = ['staff', 'admin']; // super admins are only ever set in the database

const escapeHtml = (str = '') =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cleanPermissions = (list) => [
    ...new Set((Array.isArray(list) ? list : []).filter((p) => PERMISSION_KEYS.includes(p))),
];

const summary = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
});

// A failed log write should never undo the change itself
const logActivity = async (actor, action, target, details = '') => {
    try {
        await StaffActivity.create({
            actor: actor._id,
            actorName: actor.name,
            action,
            targetName: target.name,
            targetEmail: target.email,
            details,
        });
    } catch (error) {
        console.error('Staff activity log failed:', error.message);
    }
};

// Reuses the reset-password flow: the invite link is a long-lived reset link
const createInviteLink = async (user) => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + INVITE_HOURS * 60 * 60 * 1000;
    await user.save();
    return `${FRONTEND_URL}/reset-password/${rawToken}`;
};

const sendAccessEmail = async (user, inviteLink) => {
    try {
        const roleLabel = user.role === 'admin' ? 'an administrator' : 'a staff member';
        await sendEmail({
            to: user.email,
            subject: 'You now have access to the Grand Azure Hotel admin',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #8C6D46; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; font-weight: 500;">Grand Azure Hotel</h2>
          </div>
          <div style="padding: 24px; color: #333; font-size: 14px; line-height: 1.6;">
            <p>Hi ${escapeHtml(user.name)}, you've been added as ${roleLabel} on the Grand Azure Hotel admin site.</p>
            ${inviteLink
                    ? `<p>Set your password to get started. This link expires in ${INVITE_HOURS} hours:</p>
                   <p><a href="${inviteLink}">${inviteLink}</a></p>`
                    : '<p>Sign in with your existing account and you will be taken to the admin area.</p>'
                }
          </div>
        </div>
      `,
        });
        return true;
    } catch (error) {
        console.error('Staff access email failed:', error.message);
        return false;
    }
};

// GET /api/staff
const listStaff = async (req, res) => {
    try {
        const people = await User.find({ role: { $in: ['staff', 'admin', 'superadmin'] } })
            .select('name email role permissions isActive createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json(people.map(summary));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
    }
};

// GET /api/staff/activity
const getActivity = async (req, res) => {
    try {
        const entries = await StaffActivity.find().sort({ createdAt: -1 }).limit(100);
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch activity', error: error.message });
    }
};

// POST /api/staff   { name, email, role, permissions }
// New person: account created and an email sent with a set-password link.
// Existing customer: promoted in place and told to sign in as usual.
const inviteStaff = async (req, res) => {
    try {
        const { name, email, role = 'staff', permissions } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        if (!ASSIGNABLE_ROLES.includes(role)) {
            return res.status(400).json({ message: 'Role must be staff or admin' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const finalPermissions = role === 'staff' ? cleanPermissions(permissions) : [];

        let user = await User.findOne({ email: cleanEmail });
        let isNew = false;

        if (user) {
            if (user.role !== 'customer') {
                return res.status(409).json({ message: 'This person already has staff access' });
            }
            user.role = role;
            user.permissions = finalPermissions;
            user.isActive = true;
            await user.save();
        } else {
            isNew = true;
            user = await User.create({
                name: name.trim(),
                email: cleanEmail,
                password: crypto.randomBytes(24).toString('hex'), // nobody knows it; they set their own
                role,
                permissions: finalPermissions,
                isActive: true,
            });
        }

        const inviteLink = isNew ? await createInviteLink(user) : null;
        const emailSent = await sendAccessEmail(user, inviteLink);

        await logActivity(
            req.account,
            'invited',
            user,
            role === 'staff'
                ? `Staff. Permissions: ${finalPermissions.join(', ') || 'none'}`
                : 'Admin (full access)'
        );

        res.status(201).json({
            user: summary(user),
            emailSent,
            inviteLink: emailSent ? null : inviteLink, // fallback so the super admin can pass it on by hand
        });
    } catch (error) {
        res.status(400).json({ message: 'Failed to add staff member', error: error.message });
    }
};

// Shared checks for the routes below that act on one person
const findEditableTarget = async (req, res) => {
    const target = await User.findById(req.params.id);

    if (!target || target.role === 'customer') {
        res.status(404).json({ message: 'Staff member not found' });
        return null;
    }
    if (target.role === 'superadmin') {
        res.status(403).json({ message: 'Super admin accounts cannot be changed here' });
        return null;
    }
    if (String(target._id) === String(req.account._id)) {
        res.status(400).json({ message: 'You cannot change your own access' });
        return null;
    }
    return target;
};

// PATCH /api/staff/:id   { role?, permissions?, name? }
const updateStaff = async (req, res) => {
    try {
        const target = await findEditableTarget(req, res);
        if (!target) return;

        const { role, permissions, name } = req.body;
        const changes = [];

        if (role !== undefined && role !== target.role) {
            if (!ASSIGNABLE_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Role must be staff or admin' });
            }
            changes.push(`role ${target.role} to ${role}`);
            target.role = role;
        }

        if (permissions !== undefined) {
            const clean = cleanPermissions(permissions);
            changes.push(`permissions: ${clean.join(', ') || 'none'}`);
            target.permissions = clean;
        }

        if (name && name.trim() !== target.name) {
            changes.push(`name to ${name.trim()}`);
            target.name = name.trim();
        }

        if (target.role === 'admin') target.permissions = []; // admins already have everything

        await target.save();
        await logActivity(req.account, 'updated', target, changes.join('; ') || 'No changes');

        res.status(200).json(summary(target));
    } catch (error) {
        res.status(400).json({ message: 'Failed to update staff member', error: error.message });
    }
};

// PATCH /api/staff/:id/active   { isActive }
// People are deactivated, not deleted, so tasks, messages and logs keep their history.
const setStaffActive = async (req, res) => {
    try {
        const target = await findEditableTarget(req, res);
        if (!target) return;

        const isActive = Boolean(req.body.isActive);
        target.isActive = isActive;
        await target.save();

        await logActivity(req.account, isActive ? 'reactivated' : 'deactivated', target);
        res.status(200).json(summary(target));
    } catch (error) {
        res.status(500).json({ message: 'Failed to update account', error: error.message });
    }
};

// POST /api/staff/:id/resend-invite
const resendInvite = async (req, res) => {
    try {
        const target = await findEditableTarget(req, res);
        if (!target) return;

        const inviteLink = await createInviteLink(target);
        const emailSent = await sendAccessEmail(target, inviteLink);

        await logActivity(req.account, 'invite-resent', target);
        res.status(200).json({ emailSent, inviteLink: emailSent ? null : inviteLink });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend invite', error: error.message });
    }
};

module.exports = {
    listStaff,
    getActivity,
    inviteStaff,
    updateStaff,
    setStaffActive,
    resendInvite,
};