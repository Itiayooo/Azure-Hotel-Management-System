import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Prefilled Account Details Form State
    const [accountForm, setAccountForm] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        displayName: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Protect route & fetch user bookings
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserBookings = async () => {
            try {
                const token = localStorage.getItem('azure_token');
                const res = await fetch('/api/bookings/my-bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    // Sort latest order first
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

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        alert('Account details updated successfully.');
    };

    if (!user) return null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-['Mona_Sans',sans-serif]">
            <Navbar />

            {/* Hero / Header Image Container */}
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

            {/* Settings Navigation & View Main Section */}
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
                                onClick={logout}
                                className="text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                            >
                                Log Out
                            </button>
                        </nav>
                    </div>

                    {/* Main Display Area */}
                    <div className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">

                        {/* DASHBOARD TAB */}
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

                                {/* Dashboard Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Total Bookings</span>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">{bookings.length}</p>
                                    </div>
                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Membership Tier</span>
                                        <p className="text-2xl font-semibold text-[#8C6D46] mt-1">Azure VIP</p>
                                    </div>
                                    <div className="bg-[#FAF9F6] p-5 rounded-xl border border-gray-100">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Support Status</span>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">Priority</p>
                                    </div>
                                </div>

                                {/* Quick Reservation Snapshot */}
                                {bookings.length > 0 && (
                                    <div className="mt-8 border-t border-gray-100 pt-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Latest Reservation</h3>
                                        <div className="bg-[#F5F5F3] p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{bookings[0].roomType?.name || 'Luxury Suite'}</p>
                                                <p className="text-xs text-gray-500 font-light mt-0.5">Reference: #{bookings[0].paymentReference || bookings[0]._id}</p>
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

                        {/* ORDERS TAB */}
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
                                        {/* Orders stack vertically (Latest First) */}
                                        {bookings.map((order) => (
                                            <div key={order._id} className="border border-gray-100 rounded-xl p-5 bg-[#FAF9F6] space-y-4">
                                                <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 border-b border-gray-200/60 pb-3">
                                                    <span>Order <strong className="text-gray-900">#{order.paymentReference || order._id}</strong></span>
                                                    <span>Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
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
                                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium capitalize">
                                                        {order.status || 'Confirmed'}
                                                    </span>
                                                    <span className="text-gray-400">Payment: Direct Paystack</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ACCOUNT DETAILS TAB */}
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