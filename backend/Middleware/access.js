const User = require('../Models/user.model.js');
const { ADMIN_AREA_ROLES, hasPermission } = require('../Utils/permissions.js');

const fetchAccount = async (req, res) => {
    const account = await User.findById(req.user.id).select('name email role permissions isActive');

    if (!account || account.isActive === false) {
        res.status(401).json({ message: 'This account is not active' });
        return null;
    }

    req.account = account;
    req.user.role = account.role; // so controllers that read req.user.role see the real, current role
    return account;
};

// Loads req.account for any signed-in person (customers included)
const loadAccount = async (req, res, next) => {
    try {
        const account = await fetchAccount(req, res);
        if (!account) return;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to check your account', error: error.message });
    }
};

// Staff, admins and super admins. Staff need at least one of the listed permissions.
// With no permissions listed, any staff, admin or super admin passes.
const requirePermission = (...permissions) => async (req, res, next) => {
    try {
        const account = await fetchAccount(req, res);
        if (!account) return;

        if (!ADMIN_AREA_ROLES.includes(account.role)) {
            return res.status(403).json({ message: 'Staff access required' });
        }

        const allowed =
            permissions.length === 0 || permissions.some((p) => hasPermission(account, p));
        if (!allowed) {
            return res.status(403).json({ message: "You don't have permission to do this" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to check permissions', error: error.message });
    }
};

const requireSuperAdmin = async (req, res, next) => {
    try {
        const account = await fetchAccount(req, res);
        if (!account) return;

        if (account.role !== 'superadmin') {
            return res.status(403).json({ message: 'Super admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to check permissions', error: error.message });
    }
};

module.exports = { loadAccount, requirePermission, requireSuperAdmin };