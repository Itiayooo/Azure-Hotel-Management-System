import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingVerify = () => {
    const { reference } = useParams();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyBooking = async () => {
            try {
                const response = await fetch(`https://azure-hotel-management-system.onrender.com/api/bookings/verify/${encodeURIComponent(reference)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Booking not found');
                }

                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        verifyBooking();
    }, [reference]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-['Mona_Sans',sans-serif]">
                <p className="text-sm text-gray-500">Verifying booking...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 font-['Mona_Sans',sans-serif]">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>

                    <h1 className="text-xl font-medium text-gray-900">
                        Booking Not Found
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        We could not verify this booking reference.
                    </p>
                </div>
            </div>
        );
    }

    const isValid = booking.valid;
    const details = booking.booking;

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 font-['Mona_Sans',sans-serif]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-xl w-full">

                <div className="text-center">
                    <div
                        className={`w-16 h-16 ${isValid
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-500'
                            } rounded-full flex items-center justify-center mx-auto`}
                    >
                        {isValid ? (
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </div>

                    <h1 className="text-2xl font-medium text-gray-900 mt-5">
                        {isValid ? 'Booking Verified' : 'Booking Invalid'}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Grand Azure Hotel
                    </p>
                </div>

                <div className="bg-[#EFECE6] rounded-xl p-6 mt-7 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-300/60 pb-3">
                        <span className="text-gray-500">Reference</span>
                        <span className="font-medium text-gray-900">
                            #{details.reference}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-300/60 pb-3">
                        <span className="text-gray-500">Guest</span>
                        <span className="font-medium text-gray-900">
                            {details.guestName}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-300/60 pb-3">
                        <span className="text-gray-500">Room</span>
                        <span className="font-medium text-gray-900">
                            {details.roomName}
                        </span>
                    </div>

                    {details.roomNumber && (
                        <div className="flex justify-between border-b border-gray-300/60 pb-3">
                            <span className="text-gray-500">Room Number</span>
                            <span className="font-medium text-gray-900">
                                {details.roomNumber}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between border-b border-gray-300/60 pb-3">
                        <span className="text-gray-500">Check-In</span>
                        <span className="font-medium text-gray-900">
                            {new Date(details.checkIn).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-300/60 pb-3">
                        <span className="text-gray-500">Check-Out</span>
                        <span className="font-medium text-gray-900">
                            {new Date(details.checkOut).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Payment</span>
                        <span className="font-medium text-emerald-600 capitalize">
                            {details.paymentStatus}
                        </span>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    This verification page confirms the booking information
                    stored by Grand Azure Hotel.
                </p>
            </div>
        </div>
    );
};

export default BookingVerify;