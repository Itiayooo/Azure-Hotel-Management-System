import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminEditRoom = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const [formData, setFormData] = useState({
        name: '', description: '', pricePerNight: '', capacity: '',
        bedType: '', roomSize: '', totalRooms: '',
    });
    // const [amenities, setAmenities] = useState([]);
    const [amenitiesText, setAmenitiesText] = useState('');
    const [amenityInput, setAmenityInput] = useState('');
    const [images, setImages] = useState([]);
    const [imageInput, setImageInput] = useState('');
    const [physicalRooms, setPhysicalRooms] = useState([]);
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, physicalRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8006/api/rooms/${id}`),
                    axios.get('http://127.0.0.1:8006/api/physical-rooms', { headers }),
                ]);

                const room = roomRes.data;
                setFormData({
                    name: room.name, description: room.description,
                    pricePerNight: room.pricePerNight, capacity: room.capacity,
                    bedType: room.bedType, roomSize: room.roomSize,
                    totalRooms: room.totalRooms,
                });
                // setAmenities(room.amenities || []);
                setAmenitiesText((room.amenities || []).join(', '));
                setImages(room.images || []);

                const belongsToThisType = physicalRes.data.filter(
                    (pr) => (pr.roomType?._id || pr.roomType) === id
                );
                setPhysicalRooms(belongsToThisType);
            } catch (err) {
                setError('Failed to load room details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addAmenity = () => {
        if (amenityInput.trim()) {
            setAmenities((prev) => [...prev, amenityInput.trim()]);
            setAmenityInput('');
        }
    };
    const removeAmenity = (idx) => setAmenities((prev) => prev.filter((_, i) => i !== idx));

    const addImage = () => {
        if (imageInput.trim()) {
            setImages((prev) => [...prev, imageInput.trim()]);
            setImageInput('');
        }
    };
    const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await axios.put(
                `http://127.0.0.1:8006/api/rooms/${id}`,
                {
                    ...formData,
                    pricePerNight: Number(formData.pricePerNight),
                    capacity: Number(formData.capacity),
                    totalRooms: Number(formData.totalRooms),
                    amenities: amenitiesText.split(',').map((a) => a.trim()).filter(Boolean),
                    images,
                },
                { headers }
            );
            navigate('/admin/rooms');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update room');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPhysicalRoom = async () => {
        if (!newRoomNumber.trim()) return;
        try {
            const res = await axios.post(
                'http://127.0.0.1:8006/api/physical-rooms',
                { roomNumber: newRoomNumber.trim(), roomType: id },
                { headers }
            );
            setPhysicalRooms((prev) => [...prev, res.data]);
            setNewRoomNumber('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add physical room');
        }
    };

    const handleStatusChange = async (physicalRoomId, newStatus) => {
        try {
            const res = await axios.patch(
                `http://127.0.0.1:8006/api/physical-rooms/${physicalRoomId}/status`,
                { status: newStatus },
                { headers }
            );
            setPhysicalRooms((prev) =>
                prev.map((pr) => (pr._id === physicalRoomId ? res.data : pr))
            );
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDeletePhysicalRoom = async (physicalRoomId) => {
        if (!window.confirm('Remove this physical room?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8006/api/physical-rooms/${physicalRoomId}`, { headers });
            setPhysicalRooms((prev) => prev.filter((pr) => pr._id !== physicalRoomId));
        } catch (err) {
            alert('Failed to delete physical room');
        }
    };

    const statusStyles = {
        available: 'bg-[#EBF7EE] text-[#34A853]',
        occupied: 'bg-[#EBF3FA] text-[#4A88C5]',
        maintenance: 'bg-[#FEF6E6] text-[#F1B44C]',
    };

    if (loading) {
        return <p className="text-xs text-gray-400 text-center pt-12">Loading room...</p>;
    }

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Room</span>
                <span>&gt;</span>
                <span className="text-gray-800 font-medium">Edit Room</span>
            </div>

            <h1 className="text-xl font-bold text-gray-900">Edit Room — {formData.name}</h1>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSaveDetails} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Image URLs</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste image URL"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                className="flex-1 bg-[#F8F6F2]/60 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                            />
                            <button type="button" onClick={addImage} className="bg-[#8C6D46] text-white px-3 rounded-xl">
                                <FiPlus />
                            </button>
                        </div>
                        {images.length > 0 && (
                            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group border border-gray-100">
                                        <img src={img} alt="Room" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 text-[10px]">
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-gray-100 rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        ></textarea>
                    </div>

                    {/* <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Amenities</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. Free WiFi"
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                            />
                            <button type="button" onClick={addAmenity} className="bg-[#8C6D46] text-white px-3 rounded-xl">
                                <FiPlus />
                            </button>
                        </div>
                        {amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {amenities.map((a, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-[#F8F6F2] text-gray-700 text-[10px] px-2.5 py-1 rounded-full">
                                        {a}
                                        <button type="button" onClick={() => removeAmenity(idx)}><FiX className="text-[10px]" /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div> */}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Amenities (comma-separated)
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Free WiFi, Air Conditioning, Smart TV"
                            value={amenitiesText}
                            onChange={(e) => setAmenitiesText(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition"
                        ></textarea>
                    </div>
                </div>

                <div className="lg:col-span-6 space-y-5">
                    <div>
                        {/* <label className="block text-xs font-semibold text-gray-700 mb-2">Room Type Name</label> */}
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Room Type (e.g. "Deluxe Room")</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Bed Type</label>
                        <input type="text" name="bedType" required value={formData.bedType} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Room Size</label>
                        <input type="text" name="roomSize" required value={formData.roomSize} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Capacity (guests)</label>
                        <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Price per Night (₦)</label>
                        <input type="number" name="pricePerNight" required min="0" value={formData.pricePerNight} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Total Rooms (reference count)</label>
                        <input type="number" name="totalRooms" required min="1" value={formData.totalRooms} onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition" />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving}
                            className="bg-[#8C6D46] text-white px-6 py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition shadow-sm disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Physical Rooms Table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Physical Rooms ({physicalRooms.length})</h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g. STD-029"
                        value={newRoomNumber}
                        onChange={(e) => setNewRoomNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPhysicalRoom()}
                        className="flex-1 max-w-xs bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] shadow-sm transition"
                    />
                    <button
                        onClick={handleAddPhysicalRoom}
                        className="bg-[#8C6D46] text-white px-4 py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition flex items-center gap-2"
                    >
                        <FiPlus /> Add Physical Room
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-[#FAF8F5] text-gray-500 font-medium">
                                <th className="py-3 px-4 rounded-l-lg">Room Number</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 rounded-r-lg text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {physicalRooms.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-gray-400">
                                        No physical rooms yet for this type.
                                    </td>
                                </tr>
                            ) : (
                                physicalRooms.map((pr) => (
                                    <tr key={pr._id}>
                                        <td className="py-3 px-4 font-semibold text-gray-900">{pr.roomNumber}</td>
                                        <td className="py-3 px-4">
                                            <select
                                                value={pr.status}
                                                onChange={(e) => handleStatusChange(pr._id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-medium border-none focus:outline-none cursor-pointer ${statusStyles[pr.status]}`}
                                            >
                                                <option value="available">Available</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDeletePhysicalRoom(pr._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminEditRoom;