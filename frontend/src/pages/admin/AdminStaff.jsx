import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PERMISSION_OPTIONS, PERMISSION_LABELS } from '../../utils/adminAccess';

const API = 'https://azure-hotel-management-system.onrender.com/api/staff';

const emptyForm = { name: '', email: '', role: 'staff', permissions: ['tasks'] };

const roleLabels = { superadmin: 'Super admin', admin: 'Admin', staff: 'Staff' };
const roleStyles = {
    superadmin: 'bg-[#3D2F1E] text-white',
    admin: 'bg-[#E8F0FE] text-[#4285F4]',
    staff: 'bg-[#EFECE6] text-[#6F5538]',
};

const AdminStaff = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('staff');
    const [staff, setStaff] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | { mode: 'invite' } | { mode: 'edit', person }
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(null); // { text, link }

    const token = localStorage.getItem('azure_token');
    const headers = { Authorization: `Bearer ${token}` };

    const loadAll = async () => {
        try {
            const [staffRes, activityRes] = await Promise.all([
                axios.get(API, { headers }),
                axios.get(`${API}/activity`, { headers }),
            ]);
            setStaff(staffRes.data);
            setActivity(activityRes.data);
        } catch (err) {
            console.error('Failed to load staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const openInvite = () => {
        setForm(emptyForm);
        setError('');
        setModal({ mode: 'invite' });
    };

    const openEdit = (person) => {
        setForm({
            name: person.name,
            email: person.email,
            role: person.role,
            permissions: person.permissions || [],
        });
        setError('');
        setModal({ mode: 'edit', person });
    };

    const togglePermission = (key) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(key)
                ? prev.permissions.filter((p) => p !== key)
                : [...prev.permissions, key],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (modal.mode === 'invite') {
                const res = await axios.post(API, form, { headers });
                setNotice({
                    text: res.data.emailSent
                        ? `Invitation sent to ${form.email}.`
                        : `${form.name} was added, but the email could not be sent. Share this link with them (valid for 48 hours):`,
                    link: res.data.inviteLink,
                });
            } else {
                await axios.patch(
                    `${API}/${modal.person._id}`,
                    { role: form.role, permissions: form.role === 'staff' ? form.permissions : [] },
                    { headers }
                );
                setNotice({ text: `Changes saved for ${modal.person.name}.` });
            }
            setModal(null);
            await loadAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (person) => {
        const turningOff = person.isActive;
        const question = turningOff
            ? `Deactivate ${person.name}? They will be signed out and lose access immediately.`
            : `Reactivate ${person.name}?`;
        if (!window.confirm(question)) return;

        try {
            await axios.patch(`${API}/${person._id}/active`, { isActive: !person.isActive }, { headers });
            await loadAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update account');
        }
    };

    const resendInvite = async (person) => {
        try {
            const res = await axios.post(`${API}/${person._id}/resend-invite`, {}, { headers });
            setNotice({
                text: res.data.emailSent
                    ? `A new invitation was sent to ${person.email}.`
                    : 'The email could not be sent. Share this link with them (valid for 48 hours):',
                link: res.data.inviteLink,
            });
            loadAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to resend invite');
        }
    };

    const isSelf = (person) => String(person._id) === String(user?.id);

    return (
        <div className="font-['Mona_Sans',sans-serif] space-y-6 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl font-semibold text-[#1C2024]">Staff</h1>
                <button
                    onClick={openInvite}
                    className="bg-[#8C6D46] text-white px-5 py-2.5 rounded-xl text-xs font-medium hover:opacity-90 transition"
                >
                    Add staff
                </button>
            </div>

            {notice && (
                <div className="bg-[#EBF7EE] border border-[#CDE9D4] rounded-xl p-4 text-xs text-[#2D7A3E] space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <p>{notice.text}</p>
                        <button onClick={() => setNotice(null)} className="text-[#2D7A3E]/70 hover:text-[#2D7A3E]">
                            Dismiss
                        </button>
                    </div>
                    {notice.link && (
                        <input
                            readOnly
                            value={notice.link}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-white border border-[#CDE9D4] rounded-lg px-3 py-2 text-[11px] text-gray-700"
                        />
                    )}
                </div>
            )}

            <div className="flex gap-2">
                {['staff', 'activity'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition ${tab === t ? 'bg-[#8C6D46] text-white' : 'bg-white text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        {t === 'staff' ? 'People' : 'Activity log'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6">
                <div className="overflow-x-auto">
                    {tab === 'staff' ? (
                        <table className="w-full text-left text-xs border-separate border-spacing-y-1">
                            <thead>
                                <tr className="bg-[#F3F0EC] text-[#808080] font-medium text-xs">
                                    <th className="py-2.5 px-4 font-medium rounded-l-xl">Person</th>
                                    <th className="py-2.5 px-4 font-medium">Role</th>
                                    <th className="py-2.5 px-4 font-medium">Access</th>
                                    <th className="py-2.5 px-4 font-medium">Status</th>
                                    <th className="py-2.5 px-4 font-medium rounded-r-xl text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#3B3B3B]">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-10 text-center text-gray-400">Loading...</td></tr>
                                ) : staff.length === 0 ? (
                                    <tr><td colSpan="5" className="py-10 text-center text-gray-400">No staff yet.</td></tr>
                                ) : (
                                    staff.map((person) => (
                                        <tr key={person._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-gray-900">
                                                    {person.name} {isSelf(person) && <span className="text-gray-400 font-normal">(you)</span>}
                                                </p>
                                                <p className="text-[10px] text-gray-400">{person.email}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${roleStyles[person.role]}`}>
                                                    {roleLabels[person.role]}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 max-w-xs">
                                                {person.role !== 'staff' ? (
                                                    <span className="text-gray-500">
                                                        {person.role === 'superadmin' ? 'Everything, including staff' : 'Everything except staff'}
                                                    </span>
                                                ) : person.permissions.length === 0 ? (
                                                    <span className="text-gray-400">No access yet</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {person.permissions.map((p) => (
                                                            <span key={p} className="px-2 py-0.5 rounded-full bg-[#F8F6F2] text-[10px] text-gray-600">
                                                                {PERMISSION_LABELS[p] || p}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${person.isActive ? 'bg-[#EBF7EE] text-[#34A853]' : 'bg-[#FDF0EE] text-[#EA4335]'
                                                        }`}
                                                >
                                                    {person.isActive ? 'Active' : 'Deactivated'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                {person.role === 'superadmin' || isSelf(person) ? (
                                                    <span className="text-gray-300">-</span>
                                                ) : (
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => openEdit(person)} className="text-[#8C6D46] hover:underline font-medium">
                                                            Edit
                                                        </button>
                                                        {person.isActive && (
                                                            <button onClick={() => resendInvite(person)} className="text-gray-500 hover:underline">
                                                                Resend invite
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => toggleActive(person)}
                                                            className={person.isActive ? 'text-red-500 hover:underline' : 'text-[#34A853] hover:underline'}
                                                        >
                                                            {person.isActive ? 'Deactivate' : 'Reactivate'}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-xs border-separate border-spacing-y-1">
                            <thead>
                                <tr className="bg-[#F3F0EC] text-[#808080] font-medium text-xs">
                                    <th className="py-2.5 px-4 font-medium rounded-l-xl">Date</th>
                                    <th className="py-2.5 px-4 font-medium">By</th>
                                    <th className="py-2.5 px-4 font-medium">Action</th>
                                    <th className="py-2.5 px-4 font-medium">Person</th>
                                    <th className="py-2.5 px-4 font-medium rounded-r-xl">Details</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#3B3B3B]">
                                {activity.length === 0 ? (
                                    <tr><td colSpan="5" className="py-10 text-center text-gray-400">Nothing logged yet.</td></tr>
                                ) : (
                                    activity.map((a) => (
                                        <tr key={a._id}>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {new Date(a.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">{a.actorName}</td>
                                            <td className="py-3 px-4 whitespace-nowrap capitalize">{a.action.replace('-', ' ')}</td>
                                            <td className="py-3 px-4 whitespace-nowrap">{a.targetName}</td>
                                            <td className="py-3 px-4 text-gray-500">{a.details}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {modal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5"
                    >
                        <h3 className="text-base font-semibold text-gray-900">
                            {modal.mode === 'invite' ? 'Add staff' : `Edit ${modal.person.name}`}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Full name</label>
                                <input
                                    type="text"
                                    required
                                    disabled={modal.mode === 'edit'}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] disabled:opacity-60"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    disabled={modal.mode === 'edit'}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46] disabled:opacity-60"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full bg-[#F8F6F2]/60 border border-[#EFECE6] rounded-xl px-4 py-3 text-xs text-gray-700 focus:outline-none focus:border-[#8C6D46]"
                                >
                                    <option value="staff">Staff (only the sections you tick)</option>
                                    <option value="admin">Admin (everything except staff management)</option>
                                </select>
                            </div>

                            {form.role === 'staff' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Can access</label>
                                    <div className="space-y-2">
                                        {PERMISSION_OPTIONS.map((opt) => (
                                            <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.permissions.includes(opt.key)}
                                                    onChange={() => togglePermission(opt.key)}
                                                    className="mt-0.5 accent-[#8C6D46]"
                                                />
                                                <span>
                                                    <span className="block text-xs text-gray-800 font-medium">{opt.label}</span>
                                                    <span className="block text-[10px] text-gray-400">{opt.hint}</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && <p className="text-xs text-red-500">{error}</p>}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setModal(null)}
                                className="text-xs text-gray-500 hover:text-gray-800 px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#8C6D46] text-white px-5 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-40"
                            >
                                {saving ? 'Saving...' : modal.mode === 'invite' ? 'Send invite' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminStaff;