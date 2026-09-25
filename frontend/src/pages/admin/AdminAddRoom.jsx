import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiX } from 'react-icons/fi';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminAddRoom = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const [formData, setFormData] = useState({
        name: '', description: '', pricePerNight: '', capacity: '',
        bedType: '', roomSize: '', totalRooms: '', roomNumberPrefix: '',
    });
    const [featuresText, setFeaturesText] = useState('');
    const [facilitiesText, setFacilitiesText] = useState('');
    const [images, setImages] = useState([]);
    const [imageInput, setImageInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addImage = () => {
        if (imageInput.trim()) {
            setImages((prev) => [...prev, imageInput.trim()]);
            setImageInput('');
        }
    };
    const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await axios.post(
                'http://127.0.0.1:8006/api/rooms',
                {
                    name: formData.name,
                    description: formData.description,
                    pricePerNight: Number(formData.pricePerNight),
                    capacity: Number(formData.capacity),
                    bedType: formData.bedType,
                    roomSize: formData.roomSize,
                    totalRooms: Number(formData.totalRooms),
                    roomNumberPrefix: formData.roomNumberPrefix.toUpperCase(),
                    features: featuresText.split(',').map((f) => f.trim()).filter(Boolean),
                    facilities: facilitiesText.split(',').map((f) => f.trim()).filter(Boolean),
                    images,
                },
                { headers }
            );

            navigate('/admin/rooms');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="font-['Mona_Sans',sans-serif] p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Room</span>
                <span>&gt;</span>
                <span className="text-gray-800 font-medium">Add Rooms</span>
            </div>

            <h1 className="text-xl font-semibold text-[#1C2024]">Add Rooms</h1>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 bg-white rounded-[13px] p-6 border border-gray-100 shadow-none space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Image URLs</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste image URL"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                className="flex-1 bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                            />
                            <button type="button" onClick={addImage} className="bg-[#8C6D46] text-white px-3.5 rounded-xl hover:opacity-90 transition">
                                <FiPlus />
                            </button>
                        </div>
                        {images.length > 0 && (
                            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group border border-gray-100">
                                        <img src={img} alt="Room" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition"
                                        >
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
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Features (comma-separated)
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Double bed with comfortable bedding, Clean ensuite bathroom, Air conditioning"
                            value={featuresText}
                            onChange={(e) => setFeaturesText(e.target.value)}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Facilities (comma-separated)
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Free WiFi, Air Conditioning, Smart TV"
                            value={facilitiesText}
                            onChange={(e) => setFacilitiesText(e.target.value)}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl p-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="lg:col-span-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Room Type Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Deluxe Room"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Bed Type</label>
                        <input
                            type="text"
                            name="bedType"
                            required
                            placeholder="e.g. King, Queen, Twin"
                            value={formData.bedType}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Room Size</label>
                        <input
                            type="text"
                            name="roomSize"
                            required
                            placeholder="e.g. 35 sqm"
                            value={formData.roomSize}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Capacity (guests)</label>
                        <input
                            type="number"
                            name="capacity"
                            required
                            min="1"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Price per Night (₦)</label>
                        <input
                            type="number"
                            name="pricePerNight"
                            required
                            min="0"
                            value={formData.pricePerNight}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Total Rooms of This Type</label>
                        <input
                            type="number"
                            name="totalRooms"
                            required
                            min="1"
                            value={formData.totalRooms}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Room Number Prefix</label>
                        <input
                            type="text"
                            name="roomNumberPrefix"
                            required
                            placeholder="e.g. DLX, STD, PRES"
                            value={formData.roomNumberPrefix}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] transition"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Physical rooms will be auto-created as {formData.roomNumberPrefix || 'PREFIX'}-001, {formData.roomNumberPrefix || 'PREFIX'}-002, etc.
                        </p>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#8C6D46] text-white px-6 py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-50"

                        >
                            {submitting ? 'Adding...' : 'Add Room'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminAddRoom;