import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminLayout = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;

        if (path === '/admin') return 'Dashboard';
        if (path.startsWith('/admin/guests')) return 'Guests';
        if (path.startsWith('/admin/reservations')) return 'Reservations';
        if (path.startsWith('/admin/rooms')) return 'Rooms';
        if (path.startsWith('/admin/messages')) return 'Messages';
        if (path.startsWith('/admin/settings')) return 'Settings';

        return 'Dashboard';
    };

    return (
        <div className="flex bg-[#F5F6F8] h-screen w-full overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <AdminHeader title={getPageTitle()} />

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;