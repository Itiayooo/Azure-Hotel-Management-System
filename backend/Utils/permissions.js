const PERMISSION_KEYS = [
    'dashboard',       // stats, charts, revenue, recent bookings list
    'bookings.view',   // Guests page (read only) and the room change log
    'bookings.manage', // confirm, check in, check out, cancel, change rooms
    'rooms.manage',    // create, edit, delete room types and physical rooms
    'rooms.status',    // set a physical room to available, occupied or maintenance
    'messages',        // guest chat inbox and replies
    'testimonials',    // approve or delete
    'enquiries',       // contact form submissions
    'tasks',           // shared team task board
];

// Holding the permission on the right also gives you the one on the left
const IMPLIED_BY = {
    'bookings.view': ['bookings.manage'],
    'rooms.status': ['rooms.manage'],
};

const ADMIN_AREA_ROLES = ['staff', 'admin', 'superadmin'];
const FULL_ACCESS_ROLES = ['admin', 'superadmin'];

const hasPermission = (account, permission) => {
    if (!account || account.isActive === false) return false;
    if (FULL_ACCESS_ROLES.includes(account.role)) return true;
    if (account.role !== 'staff') return false;

    const owned = account.permissions || [];
    if (owned.includes(permission)) return true;
    return (IMPLIED_BY[permission] || []).some((p) => owned.includes(p));
};

// The user object sent to the frontend after login, register, profile update and /me
const toUserPayload = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    permissions: user.permissions || [],
});

module.exports = {
    PERMISSION_KEYS,
    ADMIN_AREA_ROLES,
    FULL_ACCESS_ROLES,
    hasPermission,
    toUserPayload,
};