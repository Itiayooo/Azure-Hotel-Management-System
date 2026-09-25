import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    MessageSquare as LuMessageSquare,
    CheckSquare as LuCheckSquare,
    Bell as LuBell,
    ArrowRight as LuArrowRight,
    Clock as LuClock
} from 'lucide-react';

const AdminNotifications = () => {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [threadsRes, tasksRes] = await Promise.all([
                    axios.get('https://azure-hotel-management-system.onrender.com/api/messages/threads', { headers }),
                    axios.get('https://azure-hotel-management-system.onrender.com/api/tasks', { headers }),
                ]);
                setThreads(threadsRes.data.filter((t) => t.hasUnread));
                setTasks(tasksRes.data);

                await axios.patch('https://azure-hotel-management-system.onrender.com/api/admin/notifications/tasks-viewed', {}, { headers });
            } catch (err) {
                console.error('Failed to load notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const totalUnread = threads.length;
    const totalTasks = tasks.length;

    return (
        <div className="font-['Mona_Sans',sans-serif] min-h-screen bg-[#FDFBF7]/50 pt-4 pb-16 space-y-6">

            <div className="max-w-4xl mx-auto px-4 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Unread Messages</p>
                            <h3 className="text-2xl font-semibold text-gray-900">{totalUnread}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#7B623C]/10 text-[#7B623C] flex items-center justify-center">
                            <LuMessageSquare className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Pending Tasks</p>
                            <h3 className="text-2xl font-semibold text-gray-900">{totalTasks}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#7B623C]/10 text-[#7B623C] flex items-center justify-center">
                            <LuCheckSquare className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-1.5 bg-[#F6F4EF] p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'all'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            All ({totalUnread + totalTasks})
                        </button>

                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'messages'
                                ? 'bg-white text-[#7B623C]'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Messages
                            {totalUnread > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-[#7B623C] text-white rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === 'tasks'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Tasks
                            {totalTasks > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-700 rounded-full">
                                    {totalTasks}
                                </span>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/admin/messages')}
                        className="text-xs font-medium text-[#7B623C] hover:underline flex items-center gap-1"
                    >
                        Go to Messages <LuArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* List Content */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-16 bg-white rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* UNREAD MESSAGES */}
                        {(activeTab === 'all' || activeTab === 'messages') && threads.length > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                                    Unread Messages
                                </h2>

                                <div className="space-y-2">
                                    {threads.map((t) => (
                                        <div
                                            key={t.customer._id}
                                            onClick={() => navigate('/admin/messages')}
                                            className="group bg-white p-4 rounded-xl hover:bg-[#FDFBF7] transition-all cursor-pointer flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-[#7B623C]/10 text-[#7B623C] flex items-center justify-center font-semibold text-xs shrink-0">
                                                    {t.customer.name ? t.customer.name.charAt(0).toUpperCase() : 'G'}
                                                </div>

                                                <div className="space-y-0.5 truncate">
                                                    <p className="text-xs font-semibold text-gray-900 group-hover:text-[#7B623C] transition-colors">
                                                        {t.customer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-md">
                                                        {t.lastMessage}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <LuClock className="w-3 h-3" />
                                                    {formatTimeAgo(t.updatedAt)}
                                                </span>
                                                <LuArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#7B623C] transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* RECENT TASKS */}
                        {(activeTab === 'all' || activeTab === 'tasks') && tasks.length > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                                    Tasks
                                </h2>

                                <div className="space-y-2">
                                    {tasks.slice(0, 6).map((task) => (
                                        <div
                                            key={task._id}
                                            onClick={() => navigate('/admin')}
                                            className="group bg-white p-4 rounded-xl hover:bg-[#FDFBF7] transition-all cursor-pointer flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                                                    <LuCheckSquare className="w-4 h-4" />
                                                </div>

                                                <div className="space-y-0.5 min-w-0">
                                                    <span className="text-[10px] font-medium text-[#7B623C] bg-[#7B623C]/10 px-1.5 py-0.5 rounded">
                                                        {task.postedBy?.name || 'Staff'}
                                                    </span>
                                                    <p className="text-xs text-gray-800 truncate max-w-lg pt-0.5">
                                                        {task.text}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <LuClock className="w-3 h-3" />
                                                    {formatTimeAgo(task.createdAt)}
                                                </span>
                                                <LuArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-700 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {((activeTab === 'messages' && threads.length === 0) ||
                            (activeTab === 'tasks' && tasks.length === 0) ||
                            (threads.length === 0 && tasks.length === 0)) && (
                                <div className="bg-white rounded-xl p-10 text-center space-y-3">
                                    <div className="w-12 h-12 bg-[#F6F4EF] rounded-full flex items-center justify-center mx-auto text-[#7B623C]">
                                        <LuBell className="w-5 h-5" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-gray-900">All caught up</h3>
                                        <p className="text-xs text-gray-500">
                                            No new notifications to display right now.
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );


};

export default AdminNotifications;