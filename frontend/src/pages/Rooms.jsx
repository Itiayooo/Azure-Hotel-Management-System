import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection'
import heroImage from "../assets/room_hero.jpg"
import Footer from '../components/Footer'
import RoomDetails from './RoomDetails';


const Rooms = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8006/api/rooms")
                setRooms(response.data)
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch rooms")
            } finally {
                setLoading(false)
            }
        }

        fetchRooms()
    }, [])

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
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-3 tracking-tight">
                        A Room For Every Desire
                    </h2>
                    <p className="text-gray-600 text-sm font-light max-w-lg mx-auto">
                        Immerse yourself in beautifully designed accommodations tailored to elevate your experience.
                    </p>
                </div>

                {loading && <p className="text-center text-gray-500">Loading rooms...</p>}

                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && rooms.length === 0 && (
                    <p className="text-center text-gray-500">No rooms found.</p>
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

                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 text-amber-400 text-sm pt-1">
                                        <span>★</span>
                                        <span>★</span>
                                        <span>★</span>
                                        <span>★</span>
                                        <span className="text-gray-300">★</span>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            to={`/rooms/${room._id}`}
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