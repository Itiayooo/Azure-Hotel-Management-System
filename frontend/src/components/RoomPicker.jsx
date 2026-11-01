import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = 'https://azure-hotel-management-system.onrender.com/api/room-selection';
const ROW_SIZE = 8;

const cellStyles = {
    available: 'bg-white border-[#D8C8B3] text-[#3B3B3B] hover:border-[#8C6D46] cursor-pointer',
    selected: 'bg-[#8C6D46] border-[#8C6D46] text-white cursor-pointer',
    taken: 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed',
    held: 'bg-[#FEF6E6] border-[#FEF6E6] text-[#F1B44C] cursor-not-allowed',
    maintenance: 'bg-gray-100 border-gray-100 text-gray-300 line-through cursor-not-allowed',
    current: 'bg-[#EFECE6] border-[#3D2F1E] text-[#3D2F1E] cursor-not-allowed',
};

const legend = [
    { label: 'Available', style: 'bg-white border-[#D8C8B3]' },
    { label: 'Your pick', style: 'bg-[#8C6D46] border-[#8C6D46]' },
    { label: 'Taken', style: 'bg-gray-100 border-gray-100' },
    { label: 'Held by someone', style: 'bg-[#FEF6E6] border-[#FEF6E6]' },
    { label: 'Maintenance', style: 'bg-gray-100 border-gray-200' },
];

// useHold: true at checkout (holds the room for a few minutes). false when changing an existing booking.
const RoomPicker = ({
    roomTypeId,
    checkIn,
    checkOut,
    holderId,
    excludeBookingId,
    selectedId,
    onSelect,
    useHold = true,
}) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const loadMap = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/map`, {
                params: { roomTypeId, checkIn, checkOut, holderId, excludeBookingId },
            });
            setRooms(res.data);
        } catch (err) {
            setMessage('Could not load the room map. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [roomTypeId, checkIn, checkOut, holderId, excludeBookingId]);

    useEffect(() => {
        loadMap();
        const interval = setInterval(loadMap, 15000); // keeps the grid fresh while someone else books
        return () => clearInterval(interval);
    }, [loadMap]);

    const getCellState = (room) => {
        if (room.current) return 'current';
        if (selectedId === room._id) return 'selected';
        return room.state;
    };

    const isPickable = (room) => !room.current && room.state === 'available';

    const handlePick = async (room) => {
        if (!isPickable(room)) return;
        setMessage('');

        if (useHold) {
            try {
                await axios.post(`${API}/hold`, {
                    physicalRoomId: room._id,
                    checkIn,
                    checkOut,
                    holderId,
                });
            } catch (err) {
                setMessage(err.response?.data?.message || 'Could not hold that room.');
                loadMap();
                return;
            }
        }

        onSelect(room);
        loadMap();
    };

    const rows = [];
    for (let i = 0; i < rooms.length; i += ROW_SIZE) {
        rows.push(rooms.slice(i, i + ROW_SIZE));
    }

    if (loading) {
        return <p className="text-xs text-gray-400 py-6 text-center">Loading rooms...</p>;
    }

    return (
        <div className="space-y-4 font-['Mona_Sans',sans-serif]">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legend.map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <span className={`w-3 h-3 rounded border ${item.style}`} />
                        {item.label}
                    </span>
                ))}
            </div>

            <div className="bg-[#F8F6F2] rounded-xl p-4 space-y-3">
                <div className="bg-[#EFECE6] text-[10px] text-gray-500 text-center py-1.5 rounded-lg tracking-wide uppercase">
                    Reception
                </div>

                {rows.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No rooms found for this type.</p>
                ) : (
                    rows.map((row, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <span className="w-10 shrink-0 text-[10px] text-gray-400">Row {idx + 1}</span>
                            <div className="flex flex-wrap gap-2">
                                {row.map((room) => {
                                    const state = getCellState(room);
                                    return (
                                        <button
                                            key={room._id}
                                            type="button"
                                            disabled={!isPickable(room)}
                                            onClick={() => handlePick(room)}
                                            title={`${room.roomNumber}${room.current ? ' (current room)' : ''}`}
                                            className={`w-12 h-10 rounded-lg border text-[11px] font-medium transition-colors ${cellStyles[state]}`}
                                        >
                                            {room.roomNumber.split('-').pop()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {message && <p className="text-xs text-red-500">{message}</p>}
        </div>
    );
};

export default RoomPicker;