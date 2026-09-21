import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminLayout = () => {
    return (
        <div className="flex bg-[#F7F5F0] h-screen w-full overflow-hidden">
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Right Main Column */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header sits here: flush to top and right edges with zero surrounding padding */}
                <AdminHeader />

                {/* Page Content handles inner padding and vertical scrolling */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;