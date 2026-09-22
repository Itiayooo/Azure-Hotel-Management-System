import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiSearch,
    FiMaximize2,
    FiUser,
    FiCheckCircle,
    FiWifi,
    FiTv,
    FiWind,
    FiCoffee,
    FiShield,
    FiPlus,
    FiChevronDown
} from 'react-icons/fi';


const AdminRooms = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [physicalRooms, setPhysicalRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Room');

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, physicalRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8006/api/rooms'),
                    axios.get('http://127.0.0.1:8006/api/physical-rooms', { headers })
                ]);
                setRooms(roomsRes.data);
                setPhysicalRooms(physicalRes.data);
                if (roomsRes.data.length > 0) {
                    setSelectedRoom(roomsRes.data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Compute available/occupied counts for a given room type from physical rooms
    const getRoomCounts = (roomTypeId) => {
        const matching = physicalRooms.filter((pr) => pr.roomType?._id === roomTypeId || pr.roomType === roomTypeId);
        const available = matching.filter((pr) => pr.status === 'available').length;
        const occupied = matching.filter((pr) => pr.status === 'occupied').length;
        return { available, occupied, total: matching.length };
    };

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterType === 'All Room') return matchesSearch;

        const { available, occupied } = getRoomCounts(room._id);
        if (filterType === 'Available') return matchesSearch && available > 0;
        if (filterType === 'Occupied') return matchesSearch && occupied > 0;
        return matchesSearch;
    });

    const renderFacilityIcon = (amenity) => {
        const name = amenity.toLowerCase();
        if (name.includes('wifi')) return <FiWifi className="text-gray-500" />;
        if (name.includes('tv')) return <FiTv className="text-gray-500" />;
        if (name.includes('air') || name.includes('condition')) return <FiWind className="text-gray-500" />;
        if (name.includes('coffee')) return <FiCoffee className="text-gray-500" />;
        if (name.includes('safe')) return <FiShield className="text-gray-500" />;
        return <FiCheckCircle className="text-gray-500" />;
    };

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6">            

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8C6D46] shadow-sm transition"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-medium appearance-none pr-8 cursor-pointer focus:outline-none shadow-sm"
                        >
                            <option value="All Room">All Room</option>
                            <option value="Occupied">Has Occupied</option>
                            <option value="Available">Has Available</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                    </div>

                    <button
                        onClick={() => navigate('/admin/rooms/add')}
                        className="bg-[#8C6D46] text-white px-4 py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition shadow-sm flex items-center gap-2 whitespace-nowrap"
                    >
                        <FiPlus /> Add Room
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Side: Room Cards List */}
                <div className="lg:col-span-7 space-y-4">
                    {loading ? (
                        <p className="text-xs text-gray-400 text-center pt-8">Loading rooms...</p>
                    ) : filteredRooms.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center pt-8">No rooms found.</p>
                    ) : (
                        filteredRooms.map((room) => {
                            const isSelected = selectedRoom?._id === room._id;
                            const counts = getRoomCounts(room._id);
                            const mainImage = room.images?.[0];

                            return (
                                <div
                                    key={room._id}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 ${isSelected
                                        ? 'border-[#8C6D46] shadow-md ring-1 ring-[#8C6D46]'
                                        : 'border-gray-100 shadow-sm hover:border-gray-200'
                                        }`}
                                >
                                    {mainImage && (
                                        <img
                                            src={mainImage}
                                            alt={room.name}
                                            className="w-full sm:w-44 h-36 object-cover rounded-xl flex-shrink-0"
                                        />
                                    )}

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    {room.name}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-medium ${counts.available > 0
                                                        ? 'bg-[#EBF7EE] text-[#34A853]'
                                                        : 'bg-[#EBF3FA] text-[#4A88C5]'
                                                        }`}
                                                >
                                                    {counts.available > 0 ? 'Available' : 'Fully Occupied'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FiMaximize2 /> {room.roomSize}
                                                </span>
                                                <span>|</span>
                                                <span>{room.bedType}</span>
                                                <span>|</span>
                                                <span className="flex items-center gap-1">
                                                    <FiUser /> {room.capacity} guests
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                                                {room.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50 text-[11px]">
                                            <span className="text-gray-400 font-medium">
                                                Available Room:{' '}
                                                <strong className="text-gray-800">
                                                    {counts.available}/{counts.total || room.totalRooms}
                                                </strong>
                                            </span>
                                            <span className="text-[#8C6D46] font-bold text-sm">
                                                ₦{room.pricePerNight?.toLocaleString()}
                                                <span className="text-[10px] text-gray-400 font-normal">
                                                    /night
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right Side: Room Detail Panel */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-6">
                    {selectedRoom ? (
                        (() => {
                            const counts = getRoomCounts(selectedRoom._id);
                            const images = selectedRoom.images || [];

                            return (
                                <>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium mb-1">Room Detail</p>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedRoom.name}</h2>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Occupied Room:{' '}
                                            <strong className="text-gray-700">
                                                {counts.occupied}/{counts.total || selectedRoom.totalRooms}
                                            </strong>
                                        </p>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 h-44">
                                            <div className="col-span-2 h-full">
                                                <img
                                                    src={images[0]}
                                                    alt={selectedRoom.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                            <div className="col-span-1 flex flex-col gap-2 h-full">
                                                {images[1] && (
                                                    <img
                                                        src={images[1]}
                                                        alt="Gallery 1"
                                                        className="w-full h-[84px] object-cover rounded-xl"
                                                    />
                                                )}
                                                {images[2] && (
                                                    <div className="relative h-[84px]">
                                                        <img
                                                            src={images[2]}
                                                            alt="Gallery 2"
                                                            className="w-full h-full object-cover rounded-xl"
                                                        />
                                                        {images.length > 3 && (
                                                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white text-[10px] font-semibold cursor-pointer">
                                                                +{images.length - 3} More
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FiMaximize2 /> {selectedRoom.roomSize}
                                        </span>
                                        <span>|</span>
                                        <span>{selectedRoom.bedType}</span>
                                        <span>|</span>
                                        <span className="flex items-center gap-1">
                                            <FiUser /> {selectedRoom.capacity} guests
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        {selectedRoom.description}
                                    </p>

                                    {selectedRoom.amenities?.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-gray-900">Amenities</h4>
                                            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600">
                                                {selectedRoom.amenities.map((amenity, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5">
                                                        {renderFacilityIcon(amenity)}
                                                        <span>{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => navigate(`/admin/rooms/edit/${selectedRoom._id}`)}
                                            className="flex-1 bg-[#8C6D46] text-white py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition"
                                        >
                                            Edit Room
                                        </button>
                                    </div>
                                </>
                            );
                        })()
                    ) : (
                        <div className="py-12 text-center text-xs text-gray-400">
                            Select a room to view detailed information.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRooms;