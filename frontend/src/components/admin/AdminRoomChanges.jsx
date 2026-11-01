import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRoomChanges = () => {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchChanges = async () => {
            try {
                const res = await axios.get(
                    'https://azure-hotel-management-system.onrender.com/api/room-selection/changes',
                    { headers }
                );
                setChanges(res.data);
            } catch (err) {
                console.error('Failed to fetch room changes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchChanges();
    }, []);

    const filtered = changes.filter((c) => {
        const term = searchTerm.toLowerCase();
        return (
            c.guestName?.toLowerCase().includes(term) ||
            c.reference?.includes(searchTerm) ||
            c.fromRoomNumber?.toLowerCase().includes(term) ||
            c.toRoomNumber?.toLowerCase().includes(term) ||
            c.changedByName?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl font-semibold text-[#1C2024]">Room Changes</h1>
                <input
                    type="text"
                    placeholder="Search guest, reference or room"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[280px] bg-white text-xs text-gray-700 px-4 py-2.5 rounded-[4px] border border-[#F3F0EC] placeholder-[#1C2024]/30 focus:outline-none"
                />
            </div>

            <div className="bg-white rounded-2xl p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-separate border-spacing-y-1">
                        <thead>
                            <tr className="bg-[#F3F0EC] text-[#808080] font-medium text-xs">
                                <th className="py-2.5 px-4 font-medium rounded-l-xl whitespace-nowrap">Date</th>
                                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Reference</th>
                                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Guest</th>
                                <th className="py-2.5 px-4 font-medium whitespace-nowrap">From</th>
                                <th className="py-2.5 px-4 font-medium whitespace-nowrap">To</th>
                                <th className="py-2.5 px-4 font-medium whitespace-nowrap">Changed By</th>
                                <th className="py-2.5 px-4 font-medium rounded-r-xl whitespace-nowrap">Role</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#3B3B3B] font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-gray-400">
                                        No room changes recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {new Date(c.createdAt).toLocaleString([], {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">#{c.reference}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{c.guestName}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{c.fromRoomNumber}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{c.toRoomNumber}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{c.changedByName}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                                                    c.changedByRole === 'admin'
                                                        ? 'bg-[#E8F0FE] text-[#4285F4]'
                                                        : 'bg-[#EFECE6] text-[#6F5538]'
                                                }`}
                                            >
                                                {c.changedByRole === 'admin' ? 'Admin' : 'Guest'}
                                            </span>
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

export default AdminRoomChanges;