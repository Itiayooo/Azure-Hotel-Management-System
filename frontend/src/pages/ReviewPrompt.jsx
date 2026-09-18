import React, { useState } from 'react';

const ReviewPrompt = ({ bookingId, onReviewed }) => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        try {
            const token = localStorage.getItem('azure_token');
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId, rating, comment }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to submit review');
                return;
            }
            setSubmitted(true);
            onReviewed();
        } catch (err) {
            setError('Something went wrong.');
        }
    };

    if (submitted) {
        return <p className="text-xs text-green-700 pt-2">Thanks for rating your stay!</p>;
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="text-xs text-[#8C6D46] hover:underline font-medium pt-2"
            >
                Rate this stay
            </button>
        );
    }

    return (
        <div className="pt-3 border-t border-gray-200/60 mt-2 space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                        <svg
                            className={`w-5 h-5 ${star <= rating ? 'text-[#F5B041]' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment..."
                rows={2}
                className="w-full bg-[#F5F5F3] border-0 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#8C6D46] resize-none"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
                onClick={handleSubmit}
                className="text-xs bg-[#8C6D46] text-white px-4 py-1.5 rounded-lg"
            >
                Submit Rating
            </button>
        </div>
    );
};

export default ReviewPrompt;