import React, { useState } from 'react';

const TestimonialForm = () => {
    const [formData, setFormData] = useState({ role: '', location: '', message: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const token = localStorage.getItem('azure_token');
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ loading: false, error: data.message || 'Failed to submit testimonial', success: false });
                return;
            }

            setStatus({ loading: false, error: '', success: true });
            setFormData({ role: '', location: '', message: '' });
        } catch (err) {
            setStatus({ loading: false, error: 'Something went wrong. Please try again.', success: false });
        }
    };

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-3">
                Leave a Testimonial
            </h2>

            {status.success && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs">
                    Thank you! Your testimonial has been submitted and is pending approval.
                </div>
            )}

            {status.error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                    {status.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Your Role (e.g. CEO of a Tech Foundation)</label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Location (e.g. Lagos)</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Your Experience *</label>
                    <textarea
                        required
                        maxLength={500}
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#8C6D46] resize-none"
                        placeholder="Tell us about your stay..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status.loading}
                    className="bg-[#8C6D46] hover:bg-[#785C3A] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50"
                >
                    {status.loading ? 'Submitting...' : 'Submit Testimonial'}
                </button>
            </form>
        </div>
    );
};

export default TestimonialForm;