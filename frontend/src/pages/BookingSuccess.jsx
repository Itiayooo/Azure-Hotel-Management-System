import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reference, room, checkIn, checkOut, totalPrice, guestDetails } = location.state || {};

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-['Mona_Sans',sans-serif]">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-16 pt-32">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Reservation Confirmed!</h1>
                        <p className="text-xs text-gray-500 font-light mt-1">Ref: #{reference}</p>
                    </div>

                    <div className="bg-[#EFECE6] p-6 rounded-xl text-left space-y-3 text-xs sm:text-sm text-gray-700 font-light">
                        <div className="flex justify-between border-b border-gray-300/60 pb-2">
                            <span>Guest Name:</span>
                            <span className="font-medium text-gray-900">{guestDetails?.firstName} {guestDetails?.lastName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 pb-2">
                            <span>Room:</span>
                            <span className="font-medium text-gray-900">{room?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 pb-2">
                            <span>Dates:</span>
                            <span className="font-medium text-gray-900">{checkIn} to {checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Paid:</span>
                            <span className="font-semibold text-gray-900">₦{totalPrice?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors"
                        >
                            Download / Print Receipt
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors"
                        >
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BookingSuccess;