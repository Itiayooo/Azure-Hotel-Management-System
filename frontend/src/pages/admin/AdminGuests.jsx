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

const AdminGuests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGuestName, setSelectedGuestName] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);
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

            <div className="flex items-center justify-end mt-6 gap-3 w-full font-['Mona_Sans',sans-serif] font-medium">
                {/* Search Input Box */}
                <div className="relative flex items-center">
                    <svg
                        className="absolute left-3.5 w-4 h-4 text-[#1C2024]/40 pointer-events-none"
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
                        placeholder="Search by Name, Room or Booking ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[280px] sm:w-[320px] bg-white text-xs text-gray-700 pl-9 pr-4 py-2.5 rounded-[4px] border border-[#F3F0EC] placeholder-[#1C2024]/30 focus:outline-none font-medium"
                    />
                </div>

                {/* Date Picker Button / Input */}
                <div className="relative flex items-center bg-white border border-[#F3F0EC] rounded-[4px] px-3.5 py-2.5 gap-2.5 cursor-pointer">
                    <svg
                        className="w-4 h-4 text-[#1C2024]/70 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v3.75m0 0 1.5-1.5m-1.5 1.5-1.5-1.5" />
                    </svg>
                    <span className="text-xs text-[#1C2024] font-medium whitespace-nowrap">
                        1st-20th May, 2025
                    </span>
                    <svg
                        className="w-3.5 h-3.5 text-[#1C2024]/60 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {/* Custom Status Select Dropdown */}
                <div className="relative flex items-center">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-[#8C6D46] text-white pl-4 pr-8 py-2.5 rounded-[4px] text-xs font-medium focus:outline-none cursor-pointer"
                    >
                        <option value="All" className="bg-white text-gray-800">All Status</option>
                        <option value="pending" className="bg-white text-gray-800">Pending</option>
                        <option value="confirmed" className="bg-white text-gray-800">Confirmed</option>
                        <option value="checked-in" className="bg-white text-gray-800">Checked-In</option>
                        <option value="checked-out" className="bg-white text-gray-800">Checked-Out</option>
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

            <div className="bg-white rounded-2xl p-6 space-y-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-separate border-spacing-y-1">
                        <thead>
                            <tr className="bg-[#F3F0EC] text-[#808080] font-medium text-xs">
                                <th className="py-2.5 px-4 text-left font-medium rounded-l-xl whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                        Guest <span className="text-[10px] text-[#808080]">⇅</span>
                                    </span>
                                </th>
                                <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                        Room <span className="text-[10px] text-[#808080]">⇅</span>
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
                                <th className="py-2.5 px-4 text-left font-medium whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                                        Status <span className="text-[10px] text-[#808080]">⇅</span>
                                    </span>
                                </th>
                                <th className="py-2.5 px-4 text-center font-medium rounded-r-xl whitespace-nowrap">
                                    <span className="inline-flex items-center justify-center gap-1 cursor-pointer select-none">
                                        Action
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            className="divide-y divide-gray-50 font-['Mona_Sans'] font-medium text-[#3B3B3B]"
                        >
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        Loading guest records...
                                    </td>
                                </tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        No guest records found matching your query.
                                    </td>
                                </tr>
                            ) : (
                                paginatedGuests.map((guest) => {
                                    const nextAction = getNextAction(guest.status);
                                    const canCancel =
                                        guest.status === 'pending' || guest.status === 'confirmed';

                                    return (
                                        <tr
                                            key={guest._id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-4 relative">
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedGuestName(
                                                                selectedGuestName === guest._id
                                                                    ? null
                                                                    : guest._id
                                                            )
                                                        }
                                                        className="font-medium text-[#3B3B3B] hover:text-[#8C6D46] transition"
                                                    >
                                                        {getGuestName(guest)
                                                            .split(/\s+/)
                                                            .slice(0, 2)
                                                            .join(' ')}
                                                        {getGuestName(guest).split(/\s+/).length > 2 &&
                                                            '...'}
                                                    </button>

                                                    {selectedGuestName === guest._id && (
                                                        <div className="absolute left-4 top-16 z-20 bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 whitespace-nowrap">
                                                            <span className="font-medium text-xs text-[#3B3B3B]">
                                                                {getGuestName(guest)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <p className="text-[10px] text-[#3B3B3B] mt-0.5">
                                                        {guest._id}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                {guest.roomType?.name || 'N/A'}
                                            </td>

                                            <td className="py-4 px-4">
                                                {calculateDuration(
                                                    guest.checkIn,
                                                    guest.checkOut
                                                )}
                                            </td>

                                            <td className="py-4 px-4 relative">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedDates(
                                                            selectedDates === guest._id
                                                                ? null
                                                                : guest._id
                                                        )
                                                    }
                                                    className="hover:text-[#8C6D46] transition"
                                                >
                                                    {guest.checkIn?.split('T')[0]} —{' '}
                                                    {guest.checkOut?.split('T')[0]}
                                                </button>

                                                {selectedDates === guest._id && (
                                                    <div className="absolute left-4 top-12 z-20 bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 whitespace-nowrap">
                                                        <span className="text-xs text-[#3B3B3B] font-medium">
                                                            {guest.checkIn} — {guest.checkOut}
                                                        </span>
                                                    </div>
                                                )}
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
                                                            onClick={() =>
                                                                handleAdvanceStatus(
                                                                    guest._id,
                                                                    nextAction.endpoint
                                                                )
                                                            }
                                                            className="w-[24px] h-[24px] rounded-[4.55px] bg-[#319F43] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                                            title={nextAction.label}
                                                        >
                                                            <FiCheck className="text-xs" />
                                                        </button>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(guest._id)}
                                                            className="w-[24px] h-[24px] rounded-[4.55px] bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                                            title="Cancel Booking"
                                                        >
                                                            <FiX className="text-xs" />
                                                        </button>
                                                    )}

                                                    {!nextAction && !canCancel && (
                                                        <span className="text-gray-300 text-[10px]">
                                                            —
                                                        </span>
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