import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reference, room, checkIn, checkOut, totalPrice, guestDetails, booking } = location.state || {};
    const roomNumber = booking?.physicalRoom?.roomNumber;
    const { user } = useAuth();

    // Automatically send receipt email 
    useEffect(() => {
        const recipientEmail = user?.email || guestDetails?.email;

        if (reference && recipientEmail) {
            const sendReceiptEmail = async () => {
                try {
                    const token = localStorage.getItem('azure_token');

                    await fetch('https://azure-hotel-management-system.onrender.com/api/bookings/send-receipt-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && { Authorization: `Bearer ${token}` })
                        },
                        body: JSON.stringify({
                            reference,
                            guestDetails: guestDetails || {
                                firstName: user?.name?.split(' ')[0] || '',
                                lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                                email: user?.email
                            },
                            room,
                            roomNumber,
                            checkIn,
                            checkOut,
                            totalPrice
                        })
                    });
                } catch (err) {
                    console.error('Failed to dispatch receipt email:', err);
                }
            };

            sendReceiptEmail();
        }
    }, [reference, user, guestDetails, room, checkIn, checkOut, totalPrice]);

    if (!reference) {
        return (
            <div className="min-h-screen flex items-center justify-center font-['Mona_Sans',sans-serif] bg-[#FAF9F6]">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No active booking receipt found.</p>
                    <button
                        onClick={() => navigate('/rooms')}
                        className="bg-[#8C6D46] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#785C3A] transition-colors"
                    >
                        Back to Rooms
                    </button>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const handleDashboardOrHomeNavigation = () => {
        if (user) {
            navigate('/settings', { state: { tab: 'dashboard' } });
        } else {
            navigate('/');
        }
    };
    
    const verificationUrl = `https://grandazure.vercel.app/verify/${encodeURIComponent(reference)}`;

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-['Mona_Sans',sans-serif] flex items-center justify-center p-4">
            <style>
                {`
                @media print {
                    body {
                        background-color: #ffffff !important;
                    }
                    .print-container {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                }
                `}
            </style>

            <div className="max-w-xl w-full">
                <div className="print-container bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                    {/* Checkmark Icon */}
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto print:hidden">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Grand Azure Hotel</h1>
                        <p className="text-sm text-gray-600 font-medium mt-1">Official Booking Receipt</p>
                        <p className="text-xs text-gray-400 font-light mt-0.5">Reference: #{reference}</p>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-center print:hidden">
                        <p className="text-xs text-[#8C6D46] font-medium flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4 text-[#8C6D46] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            A copy of your receipt has been sent to <span className="underline font-semibold">{guestDetails?.email || user?.email}</span>.
                        </p>
                    </div>

                    {/* <div className="bg-[#EFECE6] print:bg-gray-50 p-6 rounded-xl text-left space-y-3 text-xs sm:text-sm text-gray-700 font-light border print:border-gray-200">
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Guest Name:</span>
                            <span className="font-medium text-gray-900">{guestDetails?.firstName} {guestDetails?.lastName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Email:</span>
                            <span className="font-medium text-gray-900">{guestDetails?.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Room Reserved:</span>
                            <span className="font-medium text-gray-900">{room?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Check-In:</span>
                            <span className="font-medium text-gray-900">{checkIn}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Check-Out:</span>
                            <span className="font-medium text-gray-900">{checkOut}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span>Total Amount Paid:</span>
                            <span className="font-semibold text-gray-900">₦{totalPrice?.toLocaleString()}</span>
                        </div>
                    </div> */}

                    <div className="bg-[#EFECE6] print:bg-gray-50 p-6 rounded-xl text-left space-y-3 text-xs sm:text-sm text-gray-700 font-light border print:border-gray-200">
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Guest Name:</span>
                            <span className="font-medium text-gray-900">{guestDetails?.firstName} {guestDetails?.lastName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Email:</span>
                            <span className="font-medium text-gray-900">{guestDetails?.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Room Reserved:</span>
                            <span className="font-medium text-gray-900">{room?.name}</span>
                        </div>
                        {roomNumber && (
                            <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                                <span>Room Number:</span>
                                <span className="font-medium text-gray-900">{roomNumber}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Check-In:</span>
                            <span className="font-medium text-gray-900">{checkIn}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300/60 print:border-gray-300 pb-2">
                            <span>Check-Out:</span>
                            <span className="font-medium text-gray-900">{checkOut}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span>Total Amount Paid:</span>
                            <span className="font-semibold text-gray-900">₦{totalPrice?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-2">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl">
                            <QRCodeSVG
                                value={verificationUrl}
                                size={112}
                                level="M"
                            />
                        </div>

                        <p className="text-[10px] text-gray-400 font-light mt-2">
                            Scan to verify booking
                        </p>
                    </div>

                    {/* Navigation & Print Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors"
                        >
                            Download / Print Receipt
                        </button>
                        <button
                            onClick={handleDashboardOrHomeNavigation}
                            className="flex-1 bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors"
                        >
                            {user ? 'View Dashboard' : 'Return to Home'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;