export const ADMIN_AREA_ROLES = ['staff', 'admin', 'superadmin'];

export const PERMISSION_OPTIONS = [
    { key: 'dashboard', label: 'Dashboard', hint: 'Stats, charts, revenue and the recent bookings list' },
    { key: 'bookings.view', label: 'View bookings', hint: 'Guests page (read only) and the room change log' },
    { key: 'bookings.manage', label: 'Manage bookings', hint: 'Confirm, check in, check out, cancel and change rooms' },
    { key: 'rooms.manage', label: 'Manage rooms', hint: 'Create, edit and delete room types and physical rooms' },
    { key: 'rooms.status', label: 'Room status', hint: 'Mark rooms available, occupied or under maintenance' },
    { key: 'messages', label: 'Messages', hint: 'Guest chat inbox and replies' },
    { key: 'testimonials', label: 'Testimonials', hint: 'Approve or delete testimonials' },
    { key: 'enquiries', label: 'Enquiries', hint: 'Contact form submissions' },
    { key: 'tasks', label: 'Tasks', hint: 'Shared team task board' },
];

export const PERMISSION_LABELS = Object.fromEntries(
    PERMISSION_OPTIONS.map((p) => [p.key, p.label])
);

// "any" = a staff member needs at least one of these. An empty list means any staff, admin or super admin.
const RULES = [
    { path: '/admin', exact: true, any: ['dashboard'] },
    { path: '/admin/guests', any: ['bookings.view', 'bookings.manage'] },
    { path: '/admin/room-changes', any: ['bookings.view'] },
    { path: '/admin/rooms', any: ['rooms.manage', 'rooms.status'] },
    { path: '/admin/messages', any: ['messages'] },
    { path: '/admin/testimonials', any: ['testimonials'] },
    { path: '/admin/enquiries', any: ['enquiries'] },
    { path: '/admin/notifications', any: [] },
    { path: '/admin/staff', superOnly: true },
];

const findRule = (path) => {
    if (path === '/admin' || path === '/admin/') return RULES[0];
    return RULES
        .filter((r) => !r.exact && path.startsWith(r.path))
        .sort((a, b) => b.path.length - a.path.length)[0];
};

export const canAccessPath = (path, user, hasPermission) => {
    if (!user || !ADMIN_AREA_ROLES.includes(user.role)) return false;

    const rule = findRule(path);
    if (!rule) return user.role !== 'staff'; // pages with no rule are for admins only
    if (rule.superOnly) return user.role === 'superadmin';
    if (rule.any.length === 0) return true;
    return rule.any.some((p) => hasPermission(p));
};

// Where a staff member lands when they can't open the page they asked for
export const getFirstAllowedPath = (user, hasPermission) => {
    const order = RULES.filter((r) => !r.superOnly && r.any.length > 0);
    const match = order.find((r) => canAccessPath(r.path, user, hasPermission));
    return match ? match.path : null;
};