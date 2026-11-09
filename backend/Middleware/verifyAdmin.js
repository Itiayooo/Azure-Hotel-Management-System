const User = require('../Models/user.model.js');

const verifyAdmin = async (req, res, next) => {
    try {
        const account = await User.findById(req.user.id).select('role isActive');

        if (!account || account.isActive === false) {
            return res.status(401).json({ message: 'This account is not active' });
        }

        if (!['admin', 'superadmin'].includes(account.role)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user.role = account.role;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to check permissions', error: error.message });
    }
};

module.exports = verifyAdmin;