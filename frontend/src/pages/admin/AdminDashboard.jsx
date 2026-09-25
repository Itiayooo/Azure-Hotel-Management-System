import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '../../components/admin/StatCard';
import { FiCalendar, FiLogOut, FiLogIn, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, LabelList, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        maintenanceRooms: 0,
        activeBookings: 0,
        todaysCheckIns: 0,
        todaysCheckOuts: 0,
        totalRevenue: 0,
    });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedGuestName, setSelectedGuestName] = useState(null);
    const [bookingStats, setBookingStats] = useState({ byMonth: [], byRoomType: [] });
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [expandedTasks, setExpandedTasks] = useState({});

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('azure_token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, bookingsRes, bookingStatsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8006/api/admin/dashboard-stats', { headers }),
                    axios.get('http://127.0.0.1:8006/api/bookings', { headers }),
                    axios.get('http://127.0.0.1:8006/api/admin/booking-stats', { headers })
                ]);

                setStats(statsRes.data);
                setBookings(bookingsRes.data);
                setBookingStats(bookingStatsRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const newBookings = bookings.filter((b) => b.status === 'pending').length;
    const reservedRooms = bookings.filter((b) => b.status === 'confirmed').length;

    const statsData = [
        {
            title: "New Bookings",
            value: newBookings,
            icon: <FiCalendar className="w-5 h-5" />
        },
        {
            title: "Check In",
            value: stats.todaysCheckIns || 0,
            icon: <FiLogIn className="w-5 h-5" />
        },
        {
            title: "Check Out",
            value: stats.todaysCheckOuts || 0,
            icon: <FiLogOut className="w-5 h-5" />
        },
        {
            title: "Total Revenue",
            value: `₦${stats.totalRevenue?.toLocaleString('en-NG') || 0}`,
            icon: <FiDollarSign className="w-5 h-5" />
        }
    ];

    const filteredBookings = bookings.filter((b) => {
        const guestName = b.customer?.name || `${b.guestDetails?.firstName || ''} ${b.guestDetails?.lastName || ''}`.trim();
        const matchesSearch =
            b._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guestName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? b.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'checked-in':
                return 'bg-emerald-50 text-emerald-600';
            case 'checked-out':
                return 'bg-rose-50 text-rose-600';
            case 'cancelled':
                return 'bg-gray-100 text-gray-500';
            default:
                return 'bg-[#E8F0FE] text-[#4285F4]';
        }
    };

    const formatStatusLabel = (status) => {
        return status?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const reservedRoomsCount = bookings ? bookings.filter((b) => b.status === 'confirmed').length : 0;

    const availabilityCategories = [
        { label: 'Occupied', count: stats?.occupiedRooms || 0, color: '#8C6D46' },
        { label: 'Available', count: stats?.availableRooms || 0, color: '#E3DAC9' },
        { label: 'Reserved', count: reservedRoomsCount, color: '#6F5538' },
        { label: 'Not Available', count: stats?.maintenanceRooms || 0, color: '#3D2F1E' },
    ];

    const totalAvailabilityRooms = availabilityCategories.reduce((sum, item) => sum + item.count, 0);

    const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const fullYearMonthlyData = ALL_MONTHS.map((m) => {
        const found = bookingStats?.byMonth?.find(
            (item) => item.month?.toLowerCase().startsWith(m.toLowerCase())
        );
        return {
            month: m,
            count: found ? found.count : 0,
        };
    });

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('azure_token');

            const res = await axios.get(
                'http://127.0.0.1:8006/api/tasks',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        if (!newTaskText.trim()) return;

        try {
            const token = localStorage.getItem('azure_token');

            const res = await axios.post(
                'http://127.0.0.1:8006/api/tasks',
                {
                    text: newTaskText.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks((prev) => [res.data, ...prev]);
            setNewTaskText('');
            setShowTaskInput(false);
        } catch (err) {
            console.error('Failed to add task:', err);
            alert(err.response?.data?.message || 'Failed to add task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8006/api/tasks/${taskId}`, { headers });
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        } catch (err) {
            alert('Failed to delete task');
            console.log(err);

        }
    };

    const toggleExpand = (id) => {
        setExpandedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="w-full min-h-full font-['Mona_Sans',sans-serif] space-y-6 p-4">

            {/* 1. Top Metrics Grid */}
            <div style={{ fontFamily: 'Mona Sans, sans-serif' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  bg-[#F5F6F8]">
                {statsData.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        loading={loading}
                    />
                ))}
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-['Mona_Sans',sans-serif]">

                {/* 1. Reservations by Month */}
                <div className="bg-white p-6 rounded-2xl border border-[#EDE9E3] font-['Mona_Sans',sans-serif]">
                    <div className="mb-3">
                        <h3 className="text-base font-semibold text-[#1E1E1E]">Reservation</h3>
                        <p className="text-xs text-[#808080] font-normal">By months</p>
                    </div>

                    <div className="w-full h-[285px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={fullYearMonthlyData}
                                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                barCategoryGap={5}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="#f3f4f6"
                                />

                                <XAxis
                                    type="number"
                                    hide
                                />

                                <YAxis
                                    dataKey="month"
                                    type="category"
                                    tick={{ fontSize: 11, fill: '#808080' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={42}
                                />

                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{
                                        borderRadius: '10px',
                                        border: '1px solid #f3f4f6',
                                        fontSize: '12px'
                                    }}
                                />

                                <Bar
                                    dataKey="count"
                                    fill="#D8C8B3"
                                    radius={[0, 6, 6, 0]}
                                    barSize={14}
                                >
                                    <LabelList
                                        dataKey="count"
                                        position="right"
                                        style={{
                                            fontSize: '10px',
                                            fill: '#1E1E1E',
                                            fontWeight: 500
                                        }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Bookings by Room Type */}
                <div className="bg-white p-6 rounded-2xl border border-[#EDE9E3]">
                    <h3 className="text-sm font-semibold text-[#1E1E1E] mb-3">Bookings by Room Type</h3>

                    <div className="w-full h-[210px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookingStats.byRoomType}
                                    dataKey="count"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={70}
                                    innerRadius={45}
                                    paddingAngle={2}
                                >
                                    {bookingStats.byRoomType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#8C6D46', '#A88B68', '#C4AB8A', '#D8C8B3', '#6F5538'][index % 5]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: '1px solid #f3f4f6' }}
                                />

                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Room Availability */}
                <div className="bg-white p-6 rounded-2xl border border-[#EDE9E3] flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-[#1E1E1E]">Room Availability</h3>
                        <p className="text-xs text-[#808080] mt-0.5">Recent</p>

                        {/* Segmented Bar */}
                        <div className="w-full h-12 flex gap-1 rounded-xl overflow-hidden mt-5 mb-6">
                            {availabilityCategories.map((item, idx) => {
                                const percentage = totalAvailabilityRooms > 0
                                    ? (item.count / totalAvailabilityRooms) * 100
                                    : 0;

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: item.color,
                                        }}
                                        className="h-full first:rounded-l-xl last:rounded-r-xl transition-all duration-300"
                                        title={`${item.label}: ${item.count}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        {availabilityCategories.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                                <div
                                    className="w-1 h-7 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />

                                <div>
                                    <p className="text-xs text-[#808080] font-normal">{item.label}</p>
                                    <p className="text-base font-semibold text-[#1E1E1E] leading-tight">
                                        {item.count}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 2. Middle Row Stats */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Room Availability</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border-l-2 border-[#4A3E2C] pl-3">
                            <p className="text-[11px] text-gray-400 font-medium">Occupied</p>
                            <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.occupiedRooms}</p>
                        </div>
                        <div className="border-l-2 border-[#8C6D46] pl-3">
                            <p className="text-[11px] text-gray-400 font-medium">Available</p>
                            <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.availableRooms}</p>
                        </div>
                        <div className="border-l-2 border-[#C5B49D] pl-3">
                            <p className="text-[11px] text-gray-400 font-medium">Reserved (Confirmed)</p>
                            <p className="text-xl font-bold text-gray-900">{loading ? '...' : reservedRooms}</p>
                        </div>
                        <div className="border-l-2 border-gray-300 pl-3">
                            <p className="text-[11px] text-gray-400 font-medium">Maintenance</p>
                            <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.maintenanceRooms}</p>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* 3. Full-Width Booking List Table & Tasks Section (Stacked) */}
            <div className="space-y-6 font-['Mona_Sans',sans-serif] w-full">

                {/* Booking List Table Container (Full Width) */}
                <div className="bg-white p-6 rounded-2xl space-y-4 w-full">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h2 className="text-lg font-semibold text-[#1C2024]">
                            Booking List
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center">
                                <svg
                                    className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-48 sm:w-64 bg-white text-xs text-gray-700 pl-9 pr-3 py-2 border border-[#F3F0EC] placeholder-gray-300 focus:outline-none rounded-[9.5px]"
                                />
                            </div>

                            <div className="relative flex items-center">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-[#8C6D46] text-white pl-3.5 pr-8 py-2 rounded-[4px] text-xs font-normal focus:outline-none cursor-pointer"
                                >
                                    <option value="" className="bg-white text-gray-800">All Status</option>
                                    {/* <option value="pending" className="bg-white text-gray-800">Pending</option> */}
                                    <option value="confirmed" className="bg-white text-gray-800">Confirmed</option>
                                    <option value="checked-in" className="bg-white text-gray-800">Checked In</option>
                                    <option value="checked-out" className="bg-white text-gray-800">Checked Out</option>
                                    <option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
                                </select>

                                <svg
                                    className="absolute right-2.5 w-3.5 h-3.5 text-white/80 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Full Display Table */}
                    <div className="w-full">
                        <table className="w-full text-left text-xs border-separate border-spacing-y-1">
                            <thead>
                                <tr className="bg-[#F3F0EC] text-[#808080] font-medium text-xs">
                                    <th className="py-2.5 px-4 text-left font-medium rounded-l-xl whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Booking ID <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Guest Name <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Room Type <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Room Number <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Duration <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Check-In & Check-Out <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                    <th className="py-2.5 px-4 text-left font-medium rounded-r-xl whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                            Status <span className="text-[10px] text-[#808080]">⇅</span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-6 px-4 text-center text-gray-400">
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-6 px-4 text-center text-gray-400">
                                            No bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((b) => {
                                        const guestName =
                                            b.customer?.name ||
                                            `${b.guestDetails?.firstName || ''} ${b.guestDetails?.lastName || ''}`.trim() ||
                                            'Guest';

                                        const checkInDate = new Date(b.checkIn);
                                        const checkOutDate = new Date(b.checkOut);

                                        const duration = Math.ceil(
                                            (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
                                        );

                                        const getStatusTextColor = (status) => {
                                            switch (status) {
                                                case 'checked-in':
                                                    return '#319F43';
                                                case 'checked-out':
                                                    return '#FF0000';
                                                case 'confirmed':
                                                    return '#4285F4';
                                                case 'cancelled':
                                                    return '#6B7280';
                                                default:
                                                    return '#F8BD00';
                                            }
                                        };

                                        return (
                                            <tr key={b._id} className="text-[#3B3B3B]">
                                                {/* Booking ID */}
                                                <td className="py-3 px-4 font-medium relative whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedBookingId(
                                                                selectedBookingId === b._id ? null : b._id
                                                            )
                                                        }
                                                        className="hover:text-[#8C6D46] transition"
                                                    >
                                                        {b._id?.slice(0, 10)}...
                                                    </button>

                                                    {selectedBookingId === b._id && (
                                                        <div className="absolute left-4 top-9 z-20 bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 whitespace-nowrap">
                                                            <span className="text-xs text-[#3B3B3B] font-medium">
                                                                {b._id}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Guest Name */}
                                                <td className="py-3 px-4 relative whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedGuestName(
                                                                selectedGuestName === b._id ? null : b._id
                                                            )
                                                        }
                                                        className="hover:text-[#8C6D46] transition"
                                                    >
                                                        {guestName.split(/\s+/).slice(0, 2).join(' ')}
                                                        {guestName.split(/\s+/).length > 2 && '...'}
                                                    </button>

                                                    {selectedGuestName === b._id && (
                                                        <div className="absolute left-0 top-9 z-20 bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 whitespace-nowrap">
                                                            <span className="text-xs text-[#3B3B3B] font-medium">
                                                                {guestName}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Room Type */}
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {b.roomType?.name || 'N/A'}
                                                </td>

                                                {/* Room Number */}
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {b.physicalRoom?.roomNumber || 'N/A'}
                                                </td>

                                                {/* Duration */}
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {duration} {duration === 1 ? 'night' : 'nights'}
                                                </td>

                                                {/* Check-In & Check-Out */}
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {b.checkIn?.split('T')[0]} — {b.checkOut?.split('T')[0]}
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <span
                                                        style={{
                                                            color: getStatusTextColor(b.status),
                                                            fontFamily: 'Mona Sans, sans-serif',
                                                            fontWeight: 500
                                                        }}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] ${getStatusBadge(b.status)}`}
                                                    >
                                                        {formatStatusLabel(b.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Task Timeline Section (Underneath Table) */}
                <div className="bg-white p-6 rounded-2xl space-y-6 w-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#1C2024]">Task</h2>
                        <button
                            type="button"
                            onClick={() => setShowTaskInput((prev) => !prev)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm font-medium"
                        >
                            +
                        </button>
                    </div>

                    {showTaskInput && (
                        <div className="flex gap-2">
                            <textarea
                                rows="2"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Add a note for the team..."
                                className="flex-1 bg-[#F8F6F2] border border-gray-100 rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46]"
                            />
                            <button
                                onClick={handleAddTask}
                                className="bg-[#8C6D46] text-white px-4 rounded-xl text-xs font-medium hover:opacity-90 transition"
                            >
                                Post
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative pl-2">
                        {tasks.length === 0 ? (
                            <p className="text-xs text-gray-400 col-span-2 text-center py-4">No tasks posted yet.</p>
                        ) : (
                            tasks.map((task, idx) => {
                                const isExpanded = expandedTasks[task._id];
                                const isLong = task.text.length > 150;
                                const displayText = isExpanded || !isLong ? task.text : task.text.slice(0, 150) + '...';

                                return (
                                    <div key={task._id} className="relative pl-6">
                                        <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#D8C8B3] bg-white z-10" />
                                        {idx < tasks.length - 1 && (
                                            <div className="hidden md:block absolute left-[6.5px] top-3.5 bottom-[-24px] w-[1px] bg-[#D8C8B3]" />
                                        )}

                                        <div className="relative bg-[#EDE9E3] p-4 rounded-xl space-y-1 group">
                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50/60 rounded-lg transition-all duration-200 focus:outline-none"
                                                title="Delete Task"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.75"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>

                                            <p className="text-[10px] font-medium text-[#8C6D46]">
                                                {task.postedBy?.name || 'Admin'}
                                            </p>
                                            <p className="text-xs font-semibold text-[#808080]">
                                                {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>

                                            <p className="text-xs font-medium text-[#1C2024] leading-relaxed pt-1">
                                                {displayText}
                                                {isLong && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExpand(task._id)}
                                                        className="font-semibold text-[#8C6D46] hover:underline ml-1"
                                                    >
                                                        {isExpanded ? ' Show Less' : ' .......Read More'}
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};



export default AdminDashboard;