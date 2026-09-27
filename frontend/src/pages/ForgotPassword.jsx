import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, sent: false, error: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, sent: false, error: '' });
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStatus({ loading: false, sent: true, error: '' });
        } catch (err) {
            setStatus({ loading: false, sent: false, error: err.message });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] font-['Mona_Sans'] px-4">
            <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-sm">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-2">Reset your password</h1>
                <p className="text-sm text-[#737373] mb-6">Enter your email and we'll send you a reset link.</p>

                {status.sent ? (
                    <p className="text-sm text-green-700">Check your inbox for a reset link.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-full border border-[#D9D9D9] text-sm focus:outline-none focus:border-[#8C6D3B]"
                        />
                        {status.error && <p className="text-xs text-red-600">{status.error}</p>}
                        <button
                            type="submit"
                            disabled={status.loading}
                            className="w-full py-3 rounded-full bg-[#8C6D3B] text-white text-sm font-medium disabled:opacity-50"
                        >
                            {status.loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <p className="text-xs text-center text-[#737373] mt-6">
                    <Link to="/login" className="text-[#8C6D3B] font-semibold hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;