import { React, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LuSearch, LuBell, LuSettings } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = ({ title = 'Dashboard' }) => {
    const { user } = useAuth();
    const [notifCounts, setNotifCounts] = useState({ unreadMessagesCount: 0, newTasksCount: 0 });

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8006/api/admin/notifications', { headers });
                setNotifCounts(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, []);

    const hasNotifications = notifCounts.unreadMessagesCount > 0 || notifCounts.newTasksCount > 0;


    return (
        <header className="w-full h-[100px] flex items-center justify-between px-8 bg-white border-b border-[#F3F0EC] font-['Mona_Sans',sans-serif] shrink-0">
            <h1 className="text-[16px] font-medium text-[#7B623C] tracking-tight">{title}</h1>

            <div className="flex items-center gap-6">
                {/* Search Input */}
                <div
                    className="relative flex items-center bg-white border border-[#F3F0EC] h-[40px] w-[371px]"
                    style={{ borderRadius: '13px' }}
                >
                    <LuSearch className="w-4 h-4 absolute left-3.5 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-full pl-10 pr-4 bg-transparent text-xs text-gray-700 placeholder-gray-300 focus:outline-none"
                    />
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#7B623C] text-white flex items-center justify-center text-xs font-semibold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        )}
                    </div>
                    <div className="text-left leading-tight">
                        <p className="text-xs font-medium text-gray-900">{user?.name || 'Don Frazze'}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Admin'}</p>
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2">
                    {/* <button
                        className="relative w-9 h-9 bg-white border border-[#F3F0EC] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ borderRadius: '10px' }}
                    >
                        <LuBell className="w-4 h-4" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                    </button> */}
                    <Link
                        to="/admin/notifications"
                        className="relative w-9 h-9 bg-white border border-[#F3F0EC] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ borderRadius: '10px' }}
                    >
                        <LuBell className="w-4 h-4" />

                        {hasNotifications && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </Link>

                    <button
                        className="w-9 h-9 bg-white border border-[#F3F0EC] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ borderRadius: '10px' }}
                    >
                        <LuSettings className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;