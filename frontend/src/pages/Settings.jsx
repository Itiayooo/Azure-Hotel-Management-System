import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'dashboard');

    const [accountForm, setAccountForm] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        displayName: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        'checked-in': 'bg-green-100 text-green-700',
        'checked-out': 'bg-gray-200 text-gray-600',
        cancelled: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        pending: 'Pending',
        confirmed: 'Upcoming',
        'checked-in': "You've Checked In",
        'checked-out': "You've Checked Out",
        cancelled: 'Cancelled',
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserBookings = async () => {
            try {
                const token = localStorage.getItem('azure_token');
                const res = await fetch('/api/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok) {
                    const sorted = (data || []).sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setBookings(sorted);
                }
            } catch (err) {
                console.error('Failed to load bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, [user, navigate]);

    // Calculate Total Spend (Excludes Cancelled Bookings)
    const totalSpent = useMemo(() => {
        return bookings
            .filter((b) => b.status !== 'cancelled')
            .reduce((acc, b) => acc + (Number(b.totalPrice) || 0), 0);
    }, [bookings]);

    // Calculate Dynamic Membership Tier & Support Status
    const { membershipTier, supportStatus } = useMemo(() => {
        if (totalSpent >= 1000000) {
            return { membershipTier: 'Azure VIP', supportStatus: 'Priority 24/7' };
        }
        if (totalSpent >= 500000) {
            return { membershipTier: 'Gold VIP', supportStatus: 'Priority 24/7' };
        }
        if (totalSpent >= 200000) {
            return { membershipTier: 'Silver Guest', supportStatus: 'Standard' };
        }
        return { membershipTier: 'Member', supportStatus: 'Standard' };
    }, [totalSpent]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Cancel this reservation?')) return;

        try {
            const token = localStorage.getItem('azure_token');
            const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const updated = await res.json();

            if (!res.ok) {
                alert(updated.message || 'Failed to cancel booking');
                return;
            }

            setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? updated : b))
            );
        } catch (err) {
            alert('Something went wrong cancelling this booking.');
        }
    };

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        if (
            accountForm.newPassword &&
            accountForm.newPassword !== accountForm.confirmPassword
        ) {
            alert('New passwords do not match.');
            return;
        }
        alert('Account details updated successfully.');
    };

    if (!user) return null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-['Mona_Sans',sans-serif]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
                <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                        alt="Grand Azure Header"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Menu */}
                    <div className="lg:col-span-3">
                        <nav className="flex flex-col space-y-1 text-xs tracking-wider uppercase font-medium">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'dashboard'
                                        ? 'bg-[#8C6D46] text-white'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'orders'
                                        ? 'bg-[#8C6D46] text-white'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                Orders & Reservations
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === 'account'
                                        ? 'bg-[#8C6D46] text-white'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                Account Details
                            </button>
                            <button
                                onClick={logout}
                                className="text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                            >
                                Log Out
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900">
                                        Welcome back, {user?.name || 'Valued Guest'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1 font-light">
                                        From your account dashboard you can view your recent reservations and edit your account profile.
                                    </p>
                                </div>

                                {/* Dynamic Dashboard Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                                            Total Bookings
                                        </span>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                                            {bookings.length}
                                        </p>
                                    </div>

                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                                            Total Spent
                                        </span>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                                            ₦{totalSpent.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                                            Membership Tier
                                        </span>
                                        <p className="text-2xl font-semibold text-[#8C6D46] mt-1">
                                            {membershipTier}
                                        </p>
                                    </div>

                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                                            Support Status
                                        </span>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                                            {supportStatus}
                                        </p>
                                    </div>
                                </div>

                                {/* Latest Reservation Snapshot */}
                                {bookings.length > 0 && (
                                    <div className="mt-8 border-t border-gray-100 pt-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">
                                            Latest Reservation
                                        </h3>
                                        <div className="bg-[#F5F5F3] p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">
                                                    {bookings[0].roomType?.name || 'Luxury Suite'}
                                                </p>
                                                <p className="text-xs text-gray-500 font-light mt-0.5">
                                                    Reference: #{bookings[0].paymentReference || bookings[0]._id}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('orders')}
                                                className="text-xs bg-[#8C6D46] text-white px-4 py-2 rounded-lg"
                                            >
                                                View Orders
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-3">
                                    Reservation History
                                </h2>

                                {loading ? (
                                    <p className="text-sm text-gray-500 py-8 text-center">Loading orders...</p>
                                ) : bookings.length === 0 ? (
                                    <p className="text-sm text-gray-500 py-8 text-center">No previous bookings found.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {bookings.map((order) => (
                                            <div
                                                key={order._id}
                                                className="border border-gray-100 rounded-xl p-5 bg-[#FAF9F6] space-y-4"
                                            >
                                                <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 border-b border-gray-200/60 pb-3">
                                                    <span>
                                                        Order <strong className="text-gray-900">#{order.paymentReference || order._id}</strong>
                                                    </span>
                                                    <span>
                                                        Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 text-sm">
                                                            {order.roomType?.name || 'Room Stay'}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-light mt-1">
                                                            Dates: {order.checkIn} — {order.checkOut}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-light">
                                                            Guests: {order.guests} Guest(s)
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-xs font-medium text-gray-500 block uppercase">Total</span>
                                                        <span className="text-base font-semibold text-[#8C6D46]">
                                                            ₦{order.totalPrice?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-2 text-xs">
                                                    <span className={`px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status] || statusStyles.pending}`}>
                                                        {statusLabels[order.status] || order.status}
                                                    </span>

                                                    {(order.status === 'pending' || order.status === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleCancelBooking(order._id)}
                                                            className="text-red-600 hover:underline font-medium"
                                                        >
                                                            Cancel Reservation
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-3">
                                    Account Details
                                </h2>

                                <form onSubmit={handleAccountUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={accountForm.firstName}
                                                onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                                                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Last Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={accountForm.lastName}
                                                onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                                                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Display Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={accountForm.displayName}
                                            onChange={(e) => setAccountForm({ ...accountForm, displayName: e.target.value })}
                                            className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                        />
                                        <span className="text-[11px] text-gray-400 font-light mt-1 block">
                                            This is how your name will be displayed in account communications.
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={accountForm.email}
                                            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                            className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900">Password Change</h3>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Current Password (leave blank to leave unchanged)</label>
                                            <input
                                                type="password"
                                                value={accountForm.currentPassword}
                                                onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                                                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">New Password (leave blank to leave unchanged)</label>
                                            <input
                                                type="password"
                                                value={accountForm.newPassword}
                                                onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-4 bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Settings;