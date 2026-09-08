import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HeroSection from '../components/HeroSection'
import heroImage from "../assets/room_hero.jpg"
import Footer from '../components/Footer'

const Rooms = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get("http://localhost:8006/rooms")
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
        <div>
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

            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6">Our Rooms</h2>

                {loading && <p>Loading rooms...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && rooms.length === 0 && (
                    <p>No rooms found.</p>
                )}

                <div className="space-y-6">
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className="border border-gray-300 rounded-lg p-6"
                        >
                            <h3 className="text-2xl font-bold mb-2">
                                {room.name}
                            </h3>

                            <p className="mb-4">
                                {room.description}
                            </p>

                            <p>
                                <strong>Price per night:</strong> ₦{room.pricePerNight.toLocaleString()}
                            </p>

                            <p>
                                <strong>Capacity:</strong> {room.capacity}
                            </p>

                            <p>
                                <strong>Bed Type:</strong> {room.bedType}
                            </p>

                            <p>
                                <strong>Room Size:</strong> {room.roomSize}
                            </p>

                            <p>
                                <strong>Total Rooms:</strong> {room.totalRooms}
                            </p>

                            <p>
                                <strong>Amenities:</strong>{" "}
                                {room.amenities?.join(", ")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Rooms

