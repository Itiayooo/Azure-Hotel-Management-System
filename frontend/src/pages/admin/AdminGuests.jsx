import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiSearch,
    FiCalendar,
    FiCheck,
    FiX,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
// import AdminHeader from '../../components/admin/AdminHeader';

const AdminGuests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchGuests = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8006/api/bookings', { headers });
            setGuests(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 'N/A';
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        return `${nights} Night${nights !== 1 ? 's' : ''}`;
    };

    const getGuestName = (booking) =>
        booking.customer?.name ||
        `${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`.trim() ||
        'Guest';

    const filteredGuests = guests.filter((guest) => {
        const name = getGuestName(guest);
        const roomName = guest.roomType?.name || '';
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || guest.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
    const paginatedGuests = filteredGuests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Determine what the "approve" action does based on current status
    const getNextAction = (status) => {
        if (status === 'pending') return { label: 'Confirm Booking', endpoint: 'confirm' };
        if (status === 'confirmed') return { label: 'Check-In Guest', endpoint: 'check-in' };
        if (status === 'checked-in') return { label: 'Check-Out Guest', endpoint: 'check-out' };
        return null;
    };

    const handleAdvanceStatus = async (bookingId, endpoint) => {
        try {
            const res = await axios.patch(
                `http://127.0.0.1:8006/api/bookings/${bookingId}/${endpoint}`,
                {},
                { headers }
            );
            setGuests((prev) =>
                prev.map((g) => (g._id === bookingId ? { ...g, status: res.data.status } : g))
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update booking status');
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            const res = await axios.patch(
                `http://127.0.0.1:8006/api/bookings/${bookingId}/cancel`,
                {},
                { headers }
            );
            setGuests((prev) =>
                prev.map((g) => (g._id === bookingId ? { ...g, status: res.data.status } : g))
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'checked-in':
                return 'bg-[#EBF7EE] text-[#34A853]';
            case 'pending':
                return 'bg-[#FEF6E6] text-[#F1B44C]';
            case 'confirmed':
                return 'bg-[#E8F0FE] text-[#4285F4]';
            case 'checked-out':
                return 'bg-gray-100 text-gray-500';
            case 'cancelled':
                return 'bg-[#FDF0EE] text-[#EA4335]';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatStatusLabel = (status) =>
        status?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6">
            {/* <AdminHeader title="Guests" /> */}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by Name, Room or Booking ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8C6D46] shadow-sm transition"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#8C6D46] text-white px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer focus:outline-none shadow-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked-in">Checked-In</option>
                        <option value="checked-out">Checked-Out</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F5] text-gray-500 font-medium">
                                <th className="py-3 px-4 rounded-l-lg">Guest</th>
                                <th className="py-3 px-4">Room</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4">Check-In & Check-Out</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 rounded-r-lg text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        Loading guest records...
                                    </td>
                                </tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        No guest records found matching your query.
                                    </td>
                                </tr>
                            ) : (
                                paginatedGuests.map((guest) => {
                                    const nextAction = getNextAction(guest.status);
                                    const canCancel = guest.status === 'pending' || guest.status === 'confirmed';

                                    return (
                                        <tr key={guest._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{getGuestName(guest)}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{guest._id}</p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 font-medium text-gray-700">
                                                {guest.roomType?.name || 'N/A'}
                                            </td>

                                            <td className="py-4 px-4 text-gray-700 font-medium">
                                                {calculateDuration(guest.checkIn, guest.checkOut)}
                                            </td>

                                            <td className="py-4 px-4 text-gray-500">
                                                {guest.checkIn} — {guest.checkOut}
                                            </td>

                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(
                                                        guest.status
                                                    )}`}
                                                >
                                                    {formatStatusLabel(guest.status)}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {nextAction && (
                                                        <button
                                                            onClick={() => handleAdvanceStatus(guest._id, nextAction.endpoint)}
                                                            className="w-6 h-6 rounded-md bg-[#22C55E] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                                            title={nextAction.label}
                                                        >
                                                            <FiCheck className="text-xs" />
                                                        </button>
                                                    )}
                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(guest._id)}
                                                            className="w-6 h-6 rounded-md bg-[#EF4444] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                                            title="Cancel Booking"
                                                        >
                                                            <FiX className="text-xs" />
                                                        </button>
                                                    )}
                                                    {!nextAction && !canCancel && (
                                                        <span className="text-gray-300 text-[10px]">—</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-50 text-xs text-gray-500">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <FiChevronLeft className="text-xs" />
                        </button>

                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${currentPage === page ? 'bg-[#8C6D46] text-white' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <FiChevronRight className="text-xs" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGuests;