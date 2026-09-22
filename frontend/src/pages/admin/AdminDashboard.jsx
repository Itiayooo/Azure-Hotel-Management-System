import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import AdminHeader from '../../components/admin/AdminHeader';

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

                {/* New Bookings Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-normal text-[#6B5A3C]">New Bookings</span>
                        <div className="p-2.5 rounded-xl border border-[#6B5A3C]/30 text-[#6B5A3C] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                        </div>
                    </div>
                    <p className="text-4xl font-semibold text-[#6B5A3C] tracking-tight leading-none">
                        {loading ? '...' : newBookings}
                    </p>
                </div>

                {/* Check In Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-normal text-[#6B5A3C]">Check In</span>
                        <div className="p-2.5 rounded-xl border border-[#6B5A3C]/30 text-[#6B5A3C] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                        </div>
                    </div>
                    <p className="text-4xl font-semibold text-[#6B5A3C] tracking-tight leading-none">
                        {loading ? '...' : stats.totalCheckIns}
                    </p>
                </div>

                {/* Check Out Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-normal text-[#6B5A3C]">Check Out</span>
                        <div className="p-2.5 rounded-xl border border-[#6B5A3C]/30 text-[#6B5A3C] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        </div>
                    </div>
                    <p className="text-4xl font-semibold text-[#6B5A3C] tracking-tight leading-none">
                        {loading ? '...' : stats.totalCheckOuts}
                    </p>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-normal text-[#6B5A3C]">Total Revenue</span>
                        <div className="p-2.5 rounded-xl border border-[#6B5A3C]/30 text-[#6B5A3C] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.76.76a4.8 4.8 0 0 1-1.17 1.17l-.76-.76" /><path d="M12.38 16.71a4.8 4.8 0 0 1-1.17 1.17" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-semibold text-[#6B5A3C] tracking-tight leading-none">
                        {loading ? '...' : `₦${stats.totalRevenue?.toLocaleString('en-NG')}`}
                    </p>
                </div>
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

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-base font-semibold text-gray-900">Booking List</h2>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search by ID or Guest Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#8C6D46] text-white px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked-in">Checked In</option>
                            <option value="checked-out">Checked Out</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
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
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {guestName.split(/\s+/).slice(0, 2).join(' ')}
                                                {guestName.split(/\s+/).length > 2 && '...'}
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