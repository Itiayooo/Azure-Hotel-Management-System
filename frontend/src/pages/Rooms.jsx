import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection'
import heroImage from "../assets/room_hero.jpg"
import Footer from '../components/Footer'

const Rooms = () => {
    const [searchParams] = useSearchParams();
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const isFilteredSearch = Boolean(checkIn && checkOut);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError("");
            try {
                const url = isFilteredSearch
                    ? `https://azure-hotel-management-system.onrender.com/api/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}${guests ? `&guests=${guests}` : ''}`
                    : "https://azure-hotel-management-system.onrender.com/api/rooms";

                const response = await axios.get(url)
                setRooms(response.data)
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch rooms")
            } finally {
                setLoading(false)
            }
        }

        fetchRooms()
    }, [checkIn, checkOut, guests, isFilteredSearch])

    return (
        <div className="bg-white min-h-screen font-['Mona_Sans',sans-serif]">
            <HeroSection
                heroImage={heroImage}
                title={
                    <>
                        Choose Your<br />
                        Perfect Stay
                    </>
                }
                description="From cozy standard rooms to luxurious suites, find the space that suits your journey."
                showSearch={true}
                centerContent={true}
            />

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-3 tracking-tight">
                        A Room For Every Desire
                    </h2>
                    <p className="text-gray-600 text-sm font-light max-w-lg mx-auto">
                        Immerse yourself in beautifully designed accommodations tailored to elevate your experience.
                    </p>

                    {isFilteredSearch && (
                        <p className="text-xs text-[#896D43] mt-3 font-medium">
                            Showing rooms available {checkIn} — {checkOut}
                            {guests ? ` for ${guests} guest(s)` : ''}
                        </p>
                    )}
                </div>

                {loading && <p className="text-center text-gray-500">Loading rooms...</p>}

                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && rooms.length === 0 && (
                    <p className="text-center text-gray-500">
                        {isFilteredSearch
                            ? "No rooms available for the selected dates/guests. Try different dates."
                            : "No rooms found."}
                    </p>
                )}

                <div className="space-y-12">
                    {rooms.map((room) => {

                        const displayImage = Array.isArray(room.images) && room.images.length > 0
                            ? room.images[0]
                            : room.image || heroImage;

                        return (
                            <div
                                key={room._id}
                                className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
                            >

                                <div className="w-full md:w-1/2 aspect-[16/10] max-h-[280px] rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src={displayImage}
                                        alt={room.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 space-y-3">
                                    <h3 className="text-2xl font-medium text-gray-900 tracking-tight">
                                        {room.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                        {room.description}
                                    </p>

                                    <div className="flex items-center gap-1 text-sm pt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.round(room.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        {room.numReviews > 0 && (
                                            <span className="text-xs text-gray-400 ml-1">({room.numReviews})</span>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            to={`/rooms/${room._id}`}
                                            state={isFilteredSearch ? { checkIn, checkOut, guests } : undefined}
                                            className="inline-flex items-center text-sm font-medium text-gray-800 hover:text-black transition-colors"
                                        >
                                            Dive In
                                            <svg
                                                className="w-4 h-4 ml-1 stroke-current"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Rooms