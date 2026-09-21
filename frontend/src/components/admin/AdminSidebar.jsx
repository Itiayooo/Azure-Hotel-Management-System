import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LuLayoutDashboard,
    LuUsers,
    LuCalendarCheck,
    LuBedDouble,
    LuMessageSquarePlus,
    LuSettings,
    LuLogOut
} from 'react-icons/lu';

import Logo from '../../assets/logo-ii.png';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LuLayoutDashboard },
        { name: 'Guest', path: '/admin/guests', icon: LuUsers },
        { name: 'Reservations', path: '/admin/reservations', icon: LuCalendarCheck },
        { name: 'Rooms', path: '/admin/rooms', icon: LuBedDouble },
        { name: 'Message', path: '/admin/messages', icon: LuMessageSquarePlus },
        { name: 'Setting', path: '/admin/settings', icon: LuSettings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-[220px] h-screen sticky top-0 bg-[#DAD2C5] p-5 flex flex-col justify-between shrink-0 font-['Mona_Sans',sans-serif] overflow-y-auto">
            <div>
                {/* Logo Section */}
                <div className="px-2 mb-8 flex items-center justify-start">                    
                    <img src={Logo} alt="Grand Azure Logo" className="h-9 w-auto object-contain" />                    
                </div>

                {/* Navigation List */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2 text-xs transition-all ${
                                        isActive
                                            ? 'bg-white/80 text-[#896D43] font-semibold'
                                            : 'text-[#302617] font-normal hover:bg-[#C2B8A8]'
                                    }`
                                }
                                style={{ borderRadius: '10px' }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <IconComponent 
                                            className={`w-4 h-4 shrink-0 ${
                                                isActive ? 'text-[#896D43]' : 'text-[#302617]'
                                            }`} 
                                        />
                                        <span>{item.name}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Log Out Button */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2 text-xs font-normal text-[#302617] hover:bg-[#C2B8A8] transition-colors mt-auto"
                style={{ borderRadius: '10px' }}
            >
                <LuLogOut className="w-4 h-4 shrink-0 text-[#302617]" />
                <span>Log Out</span>
            </button>
        </aside>
    );
};

export default AdminSidebar;