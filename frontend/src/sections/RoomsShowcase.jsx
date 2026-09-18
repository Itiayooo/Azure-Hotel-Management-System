import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RoomsShowcase = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8006/api/rooms");
                setRooms(response.data);
            } catch (error) {
                console.error('Failed to load rooms for showcase:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading || rooms.length === 0) return null;

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 font-['Mona_Sans',sans-serif]">
            {/* Header Layout */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-[42px] leading-[1.15] font-medium text-[#282828] tracking-tight">
                        Explore Our Best
                    </h2>
                    <h2 className="text-[42px] leading-[1.15] font-medium text-[#282828] tracking-tight">
                        Rooms List
                    </h2>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-5">
                    <p className="text-xs sm:text-sm text-gray-400 max-w-md font-normal leading-relaxed lg:text-right">
                        Discover our carefully curated collection of rooms and suites, designed for ultimate comfort and refined luxury..
                    </p>

                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Find Rooms"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200/80 rounded-full py-3 pl-6 pr-12 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredRooms.map((room) => {
                    const displayImage = Array.isArray(room.images) && room.images.length > 0
                        ? room.images[0]
                        : null;

                    return (
                        <Link
                            key={room._id}
                            to={`/rooms/${room._id}`}
                            className="block group"
                        >
                            <div className="aspect-[16/11] rounded-[22px] overflow-hidden bg-gray-100 mb-4">
                                {displayImage && (
                                    <img
                                        src={displayImage}
                                        alt={room.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-medium text-[#1A1A1A] tracking-tight">
                                    {room.name}
                                </h3>

                                <p className="text-xs text-gray-400 font-normal">
                                    {room.bedType} Bed, {room.roomSize}
                                </p>

                                {/* 5-Star Rating Indicator */}
                                <div className="flex items-center gap-1 pt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < Math.round(room.rating || 0) ? 'text-[#F5B041]' : 'text-gray-200'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    {room.numReviews > 0 && (
                                        <span className="text-[10px] text-gray-400 ml-1">({room.numReviews})</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default RoomsShowcase;