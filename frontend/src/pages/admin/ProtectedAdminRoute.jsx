import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_AREA_ROLES } from '../../utils/adminAccess';


const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || !ADMIN_AREA_ROLES.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;