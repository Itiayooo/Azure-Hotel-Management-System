import React, { useState } from 'react';
import axios from 'axios';
import RoomPicker from './RoomPicker';

const API = 'https://azure-hotel-management-system.onrender.com/api/room-selection';

// Works for both sides: a guest changing their own booking, or an admin reassigning.
// The server decides who is allowed to do what.
const ChangeRoomModal = ({ booking, onClose, onChanged }) => {
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const roomTypeId = booking.roomType?._id || booking.roomType;
    const checkIn = booking.checkIn?.split('T')[0];
    const checkOut = booking.checkOut?.split('T')[0];

    const handleConfirm = async () => {
        if (!selected) return;
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('azure_token');
            const res = await axios.patch(
                `${API}/change-room/${booking._id}`,
                { newRoomId: selected._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChanged(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not change the room.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 font-['Mona_Sans',sans-serif]">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">Change room</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {booking.roomType?.name}, {checkIn} to {checkOut}. Currently in{' '}
                        <strong className="text-gray-800">{booking.physicalRoom?.roomNumber || 'N/A'}</strong>.
                    </p>
                </div>

                <RoomPicker
                    roomTypeId={roomTypeId}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    excludeBookingId={booking._id}
                    selectedId={selected?._id}
                    onSelect={setSelected}
                    useHold={false}
                />

                {selected && (
                    <p className="text-xs text-gray-600">
                        Move to room <strong>{selected.roomNumber}</strong>. An updated receipt will be emailed to the guest.
                    </p>
                )}

                {error && <p className="text-xs text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs text-gray-500 hover:text-gray-800 px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selected || saving}
                        className="bg-[#8C6D46] text-white px-5 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-40"
                    >
                        {saving ? 'Saving...' : 'Confirm change'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeRoomModal;