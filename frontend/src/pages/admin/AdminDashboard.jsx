import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/admin/AdminHeader';

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
        <div className="font-['Mona_Sans',sans-serif] space-y-6">
            <AdminHeader title="Dashboard" />

            {/* 1. Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-500">New Bookings</span>
                    <p className="text-2xl font-semibold text-gray-900 tracking-tight mt-2">
                        {loading ? '...' : newBookings}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-500">Total Check-Ins</span>
                    <p className="text-2xl font-semibold text-gray-900 tracking-tight mt-2">
                        {loading ? '...' : stats.totalCheckIns}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-500">Total Check-Outs</span>
                    <p className="text-2xl font-semibold text-gray-900 tracking-tight mt-2">
                        {loading ? '...' : stats.totalCheckOuts}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-500">Total Revenue</span>
                    <p className="text-2xl font-semibold text-gray-900 tracking-tight mt-2">
                        {loading ? '...' : `₦${stats.totalRevenue?.toLocaleString()}`}
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
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-100 pb-2">
                                <th className="py-2 font-medium">Booking ID</th>
                                <th className="py-2 font-medium">Guest Name</th>
                                <th className="py-2 font-medium">Room Type</th>
                                <th className="py-2 font-medium">Room Number</th>
                                <th className="py-2 font-medium">Check-In & Check-Out</th>
                                <th className="py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-6 text-center text-gray-400">Loading bookings...</td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-6 text-center text-gray-400">No bookings found.</td>
                                </tr>
                            ) : (
                                filteredBookings.map((b) => {
                                    const guestName = b.customer?.name || `${b.guestDetails?.firstName || ''} ${b.guestDetails?.lastName || ''}`.trim() || 'Guest';
                                    return (
                                        <tr key={b._id} className="text-gray-700">
                                            <td className="py-3 font-semibold text-gray-900">{b._id}</td>
                                            <td className="py-3">{guestName}</td>
                                            <td className="py-3">{b.roomType?.name || 'N/A'}</td>
                                            <td className="py-3">{b.physicalRoom?.roomNumber || 'N/A'}</td>
                                            <td className="py-3 text-gray-500">{b.checkIn} — {b.checkOut}</td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(b.status)}`}>
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