import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get('https://azure-hotel-management-system.onrender.com/api/testimonials/all', { headers });
            setTestimonials(res.data);
        } catch (err) {
            console.error('Failed to fetch testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleApprove = async (id) => {
        try {
            const res = await axios.patch(
                `https://azure-hotel-management-system.onrender.com/api/testimonials/${id}/approve`,
                {},
                { headers }
            );
            setTestimonials((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        } catch (err) {
            alert('Failed to approve testimonial');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            await axios.delete(`https://azure-hotel-management-system.onrender.com/api/testimonials/${id}`, { headers });
            setTestimonials((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            alert('Failed to delete testimonial');
        }
    };

    const filtered = testimonials.filter((t) =>
        filter === 'pending' ? !t.isApproved : filter === 'approved' ? t.isApproved : true
    );

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[#1C2024]">Testimonials</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white border border-[#F3F0EC] rounded-[4px] px-3.5 py-2 text-xs font-medium focus:outline-none"
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="all">All</option>
                </select>
            </div>

            {loading ? (
                <p className="text-xs text-gray-400 text-center py-12">Loading...</p>
            ) : filtered.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-12">Nothing here.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((t) => (
                        <div key={t._id} className="bg-white rounded-2xl p-5 border border-[#F3F0EC] space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {t.role}{t.location && `, ${t.location}`}
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${t.isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {t.isApproved ? 'Approved' : 'Pending'}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed">"{t.message}"</p>

                            <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                {!t.isApproved && (
                                    <button
                                        onClick={() => handleApprove(t._id)}
                                        className="flex items-center gap-1.5 text-xs text-white bg-[#8C6D46] px-3 py-1.5 rounded-lg hover:opacity-90"
                                    >
                                        <FiCheck /> Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;