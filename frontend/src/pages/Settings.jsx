import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialForm from '../components/TestimonialForm';
import { useAuth } from '../context/AuthContext';
import ReviewPrompt from './ReviewPrompt';
// import MessagesPanel from '../components/MessagesPanel';
import MessagesPanel from '../components/MessagePanel';

const Settings = () => {
    const { user, logout, updateUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingAccount, setUpdatingAccount] = useState(false);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'dashboard');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [accountForm, setAccountForm] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Populate form data once user context resolves
    useEffect(() => {
        if (user) {
            const nameParts = user.name ? user.name.split(' ') : [];
            setAccountForm((prev) => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                displayName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

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
        if (authLoading) return;
        if (!user) {
            if (!isLoggingOut) navigate('/login');
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
    }, [user, authLoading, isLoggingOut, navigate]);

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
        if (!window.confirm('Are you sure you want to cancel this reservation? Refund requests may be subject to the hotel’s cancellation policy. Please contact us through the appropriate support channels for assistance with your refund.')) return;

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

    const handleAccountUpdate = async (e) => {
        e.preventDefault();

        if (
            accountForm.newPassword &&
            accountForm.newPassword !== accountForm.confirmPassword
        ) {
            alert('New passwords do not match.');
            return;
        }

        try {
            setUpdatingAccount(true);
            const token = localStorage.getItem('azure_token');
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: accountForm.displayName || `${accountForm.firstName} ${accountForm.lastName}`.trim(),
                    email: accountForm.email,
                    currentPassword: accountForm.currentPassword || undefined,
                    newPassword: accountForm.newPassword || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Failed to update account details.');
                return;
            }

            alert('Account details updated successfully.');
            updateUser(data.user);

            setAccountForm((prev) => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error(err);
            alert('An error occurred while saving your changes.');
        } finally {
            setUpdatingAccount(false);
        }
    };

    if (authLoading || (!user && !isLoggingOut)) return null;

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
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard'
                                    ? 'bg-[#8C6D46] text-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                    ? 'bg-[#8C6D46] text-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Orders & Reservations
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'account'
                                    ? 'bg-[#8C6D46] text-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Account Details
                            </button>
                            <button
                                onClick={() => setActiveTab('testimonial')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'testimonial'
                                    ? 'bg-[#8C6D46] text-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Leave a Testimonial
                            </button>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'messages'
                                    ? 'bg-[#8C6D46] text-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Messages
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(true)}
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

                                                {/* <div className="flex justify-between items-center pt-2 text-xs">
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
                                                </div> */}
                                                <div className="flex justify-between items-center pt-2 text-xs">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status] || statusStyles.pending
                                                            }`}
                                                    >
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

                                                {/* Review Prompt */}
                                                {order.status === 'confirmed' && !order.hasReview && (
                                                    <ReviewPrompt
                                                        bookingId={order._id}
                                                        onReviewed={() => {
                                                            setBookings((prev) =>
                                                                prev.map((b) =>
                                                                    b._id === order._id
                                                                        ? { ...b, hasReview: true }
                                                                        : b
                                                                )
                                                            );
                                                        }}
                                                    />
                                                )}
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

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={accountForm.confirmPassword}
                                                onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                                                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updatingAccount}
                                        className="mt-4 bg-[#8C6D46] hover:bg-[#785C3A] disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                                    >
                                        {updatingAccount ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'testimonial' && (
                            <TestimonialForm />
                        )}

                        {activeTab === 'messages' && (
                            <MessagesPanel />
                        )}
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl flex flex-col items-center">
                        {/* Top Circle Icon */}
                        <div className="w-20 h-20 rounded-full bg-[#F5F2EC] flex items-center justify-center mb-6">
                            <svg
                                className="w-8 h-8 text-[#8C6D46] transform translate-x-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </div>

                        {/* Title & Copy */}
                        <h3 className="text-xl font-medium text-[#8C6D46] mb-2 tracking-tight">
                            Already Leaving?
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[240px] mb-8">
                            Thank you for staying with Grand Azure. We hope to see you again soon.
                        </p>

                        {/* Actions */}
                        <div className="w-full space-y-4">
                            <button
                                onClick={() => {
                                    setIsLoggingOut(true);
                                    setShowLogoutModal(false);
                                    logout();
                                    navigate('/');
                                }}
                                className="w-full bg-[#8C6D46] hover:bg-[#785C3A] text-white py-3.5 rounded-full text-xs font-medium tracking-wide transition-colors shadow-sm"
                            >
                                Log Out
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="block w-full text-xs text-[#8C6D46] hover:underline font-medium pt-1"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Settings;

