import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8006/api/rooms/${id}`);
                setRoom(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load room details');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [id]);

    const renderFacilityIcon = (facility) => {
        const name = facility.toLowerCase();

        if (name.includes('wifi') || name.includes('wi-fi')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.008v.008H12v-.008z" />
                </svg>
            );
        }
        if (name.includes('air') || name.includes('condition')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364 6.364l-12.728-12.728m0 12.728L18.364 5.636" />
                </svg>
            );
        }
        if (name.includes('tv')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-6-3v3m6-3a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H6a2.25 2.25 0 00-2.25 2.25v8.25A2.25 2.25 0 006 17.25h12z" />
                </svg>
            );
        }
        if (name.includes('safe')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            );
        }
        if (name.includes('coffee')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3m4-3v3m4-3v3" />
                </svg>
            );
        }
        if (name.includes('fridge') || name.includes('refrigerator')) {
            return (
                <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-7m-7 0h7m7 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2m7 0v12" />
                </svg>
            );
        }

        return (
            <svg className="w-4 h-4 text-[#896D43] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        );
    };

    const handlePrevImage = () => {
        if (!room?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        if (!room?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500 font-['Mona_Sans',sans-serif]">Loading room details...</div>;
    }

    if (error || !room) {
        return <div className="min-h-screen flex items-center justify-center text-red-500 font-['Mona_Sans',sans-serif]">{error || 'Room not found'}</div>;
    }

    const imagesList = Array.isArray(room.images) && room.images.length > 0 ? room.images : [];


    // Book function
    const handleBookNow = () => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates.');
            return;
        }

        navigate('/checkout', {
            state: {
                room,
                checkIn,
                checkOut,
                guests
            }
        });
    };

    return (
        <div className="bg-white min-h-screen font-['Mona_Sans',sans-serif]">

            <div className="w-full">
                <div
                    className="w-full min-h-screen bg-black bg-cover bg-center relative flex flex-col justify-between transition-all duration-500"
                    style={{ backgroundImage: `url(${imagesList[currentImageIndex]})` }}
                >
                    <div className="absolute inset-0 bg-black/30 z-0" />

                    <div className="relative z-20 w-full">
                        <Navbar />
                    </div>

                    {imagesList.length > 1 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-between px-4 sm:px-8 md:px-12 pointer-events-none">
                            <button
                                onClick={handlePrevImage}
                                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                                aria-label="Previous Image"
                            >
                                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={handleNextImage}
                                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                                aria-label="Next Image"
                            >
                                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight mb-3">
                                {room.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 font-light">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    {room.roomSize}
                                </span>
                                <span>|</span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {room.bedType} Bedroom
                                </span>
                                <span>|</span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    {room.capacity} guests
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light">
                            {room.description}
                        </p>

                        {room.features?.length > 0 && (
                            <div className="space-y-4 pt-2">
                                <h2 className="text-xl font-medium text-gray-900 tracking-tight">Features</h2>
                                <ul className="space-y-3">
                                    {room.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-light">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ backgroundColor: '#DAD2C5', color: '#896D43' }}
                                            >
                                                <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {room.facilities?.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h2 className="text-xl font-medium text-gray-900 tracking-tight">Facilities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                                    {room.facilities.map((facility, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 font-light">
                                            {renderFacilityIcon(facility)}
                                            <span>{facility}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-[#EFECE6] p-6 sm:p-8 rounded-2xl space-y-6 sticky top-8">
                            <div className="flex items-baseline justify-between border-b border-gray-300/60 pb-4">
                                <h3 className="text-lg font-medium text-gray-900 tracking-wider uppercase">RESERVE:</h3>
                                <div className="text-right">
                                    <span className="text-xl sm:text-2xl font-semibold text-gray-900">
                                        ₦{room.pricePerNight?.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500 font-light"> /night</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-600 font-light mb-1">Check-In</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full bg-white border-0 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 focus:ring-1 focus:ring-amber-700 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 font-light mb-1">Check-Out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="w-full bg-white border-0 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 focus:ring-1 focus:ring-amber-700 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-600 font-light mb-1">Person</label>
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                        className="w-full bg-white border-0 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 focus:ring-1 focus:ring-amber-700 outline-none"
                                    >
                                        {[...Array(room.capacity || 2)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-300/60 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">Total Cost</span>
                                <span className="text-lg sm:text-xl font-semibold text-gray-900">
                                    ₦{room.pricePerNight?.toLocaleString()}
                                </span>
                            </div>

                            <button onClick={handleBookNow} className="w-full bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm">
                                Book Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RoomDetails;