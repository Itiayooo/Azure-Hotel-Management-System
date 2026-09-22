import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '../../components/admin/StatCard';
import { FiCalendar, FiLogOut, FiLogIn, FiDollarSign } from 'react-icons/fi';

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('azure_token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, bookingsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8006/api/admin/dashboard-stats', { headers }),
                    axios.get('http://127.0.0.1:8006/api/bookings', { headers })
                ]);

                setStats(statsRes.data);
                setBookings(bookingsRes.data);
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
                return 'bg-amber-50 text-amber-600';
        }
    };

    const formatStatusLabel = (status) => {
        return status?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <div className="w-full min-h-full font-['Mona_Sans',sans-serif] space-y-6">

            {/* 1. Top Metrics Grid */}
            <div style={{ fontFamily: 'Mona Sans, sans-serif' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#F8F9FA]">
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

            {/* 2. Middle Row Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            </div>

            {/* 3. Dynamic Booking List Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">

                <div className="flex items-center justify-between flex-wrap gap-4 font-['Mona_Sans',sans-serif]">
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
                                className="w-64 bg-white text-xs text-gray-700 pl-9 pr-3 py-2 border border-[#F3F0EC] placeholder-gray-300 focus:outline-none rounded-[9.5px]"

                            />
                        </div>

                        <div className="relative flex items-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-[#8C6D46] text-white pl-3.5 pr-8 py-2 rounded-[4px] text-xs font-normal focus:outline-none cursor-pointer"
                            >
                                <option value="" className="bg-white text-gray-800">All Status</option>
                                <option value="pending" className="bg-white text-gray-800">Pending</option>
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

                <div className="overflow-x-auto">
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
                                                return '#F8BD00';
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
                                            {/* Guest Name */}
                                            <td className="py-3 relative">
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
        </div>
    );
};



export default AdminDashboard;