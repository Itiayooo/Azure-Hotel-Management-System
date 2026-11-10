import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFirstAllowedPath } from '../../../utils/adminAccess';


const RequirePermission = ({ permission, superAdminOnly = false, children }) => {
    const { user, hasPermission } = useAuth();

    const list = Array.isArray(permission) ? permission : permission ? [permission] : [];
    const allowed = superAdminOnly
        ? user?.role === 'superadmin'
        : list.length === 0 || list.some((p) => hasPermission(p));

    if (allowed) return children;

    const fallback = getFirstAllowedPath(user, hasPermission);
    if (fallback) return <Navigate to={fallback} replace />;

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 font-['Mona_Sans',sans-serif]">
            <h1 className="text-xl font-semibold text-[#282828] mb-2">No sections assigned yet</h1>
            <p className="text-xs text-[#808080] max-w-sm">
                Your account is active, but you haven't been given access to any admin section.
                Ask the super admin to update your permissions.
            </p>
        </div>
    );
};

export default RequirePermission;