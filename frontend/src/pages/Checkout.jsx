import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { room, checkIn, checkOut, guests } = location.state || {};

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center font-['Mona_Sans',sans-serif]">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No booking information found.</p>
                    <button onClick={() => navigate('/rooms')} className="bg-[#8C6D46] text-white px-6 py-2 rounded-lg">
                        Back to Rooms
                    </button>
                </div>
            </div>
        );
    }

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const nights = calculateNights();
    const totalPrice = room.pricePerNight * nights;

    // Config with reactive email dependency
    const config = {
        reference: new Date().getTime().toString(),
        email: formData.email,
        amount: totalPrice * 100,
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
    };

    const onSuccess = (reference) => {
        console.log("PAYMENT SUCCESS:", reference);

        navigate('/booking-success', {
            state: {
                reference: reference.reference || reference.trxref,
                room,
                checkIn,
                checkOut,
                guests,
                totalPrice,
                guestDetails: formData
            }
        });
    };

    const onClose = () => {
        alert('Payment cancelled.');
    };

    // Initialize hook after config is built with reactive state
    const initializePayment = usePaystackPayment(config);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.email || !formData.phone) {
            alert('Please fill in all required guest details.');
            return;
        }

        // Pass callbacks explicitly into initializePayment
        initializePayment({ onSuccess, onClose });
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-['Mona_Sans',sans-serif]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pt-28">
                <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-8 tracking-tight">
                    Confirm Reservation & Pay
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-3">
                            Guest Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                        placeholder="Jon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                        placeholder="Snow"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                    placeholder="jon.snow@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                                    placeholder="+234 800 000 0000"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm"
                            >
                                Pay ₦{totalPrice.toLocaleString()} via Paystack
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#EFECE6] p-6 sm:p-8 rounded-2xl space-y-6 sticky top-28">
                            <h3 className="text-md font-medium text-gray-900 tracking-wider uppercase border-b border-gray-300/60 pb-3">
                                Booking Summary
                            </h3>

                            <div className="flex gap-4 items-center">
                                {room.images?.[0] && (
                                    <img src={room.images[0]} alt={room.name} className="w-20 h-20 rounded-lg object-cover" />
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">{room.name}</h4>
                                    <p className="text-xs text-gray-500 font-light mt-0.5">{room.bedType} Bed</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs sm:text-sm text-gray-600 font-light border-t border-b border-gray-300/60 py-4">
                                <div className="flex justify-between">
                                    <span>Check-In:</span>
                                    <span className="font-medium text-gray-900">{checkIn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Check-Out:</span>
                                    <span className="font-medium text-gray-900">{checkOut}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-medium text-gray-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Guests:</span>
                                    <span className="font-medium text-gray-900">{guests} Guest(s)</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-gray-900">
                                <span className="text-sm font-medium">Total Cost</span>
                                <span className="text-xl font-semibold">₦{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;