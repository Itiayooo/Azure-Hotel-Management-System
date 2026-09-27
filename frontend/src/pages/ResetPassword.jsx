import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '' });
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            alert('Password reset! Please log in.');
            navigate('/login');
        } catch (err) {
            setStatus({ loading: false, error: err.message });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] font-['Mona_Sans'] px-4">
            <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-sm">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-2">Set new password</h1>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 6 chars)"
                        className="w-full px-4 py-3 rounded-full bg-[#EAEAEA] text-sm focus:outline-none"
                    />
                    {status.error && <p className="text-xs text-red-600">{status.error}</p>}
                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full py-3 rounded-full bg-[#8C6D3B] text-white text-sm font-medium disabled:opacity-50"
                    >
                        {status.loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <p className="text-xs text-center text-[#737373] mt-6">
                    <Link to="/login" className="text-[#8C6D3B] font-semibold hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;