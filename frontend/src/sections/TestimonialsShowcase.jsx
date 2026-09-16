import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestimonialsShowcase = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8006/api/testimonials");
                setTestimonials(response.data);
            } catch (error) {
                console.error('Failed to load testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading || testimonials.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 py-16 font-['Mona_Sans',sans-serif]">
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-[#b68b47] font-semibold mb-3">
                    Testimonials
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-normal leading-[1.2] text-[#1F1F1F] tracking-tight">
                    Don't Take Our Word For It!<br />
                    Hear It From Our Top Clients
                </h2>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory">
                {testimonials.map((t) => (
                    <div
                        key={t._id}
                        className="min-w-[320px] max-w-[360px] sm:min-w-[380px] sm:max-w-[400px] bg-white p-8 sm:p-10 rounded-[28px] border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] shrink-0 flex flex-col justify-between snap-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                        {/* Quote Content */}
                        <div className="relative pt-4">
                            <span className="absolute -top-3 -left-2 text-6xl text-gray-200/50 font-serif pointer-events-none select-none">
                                “
                            </span>
                            <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed relative z-10">
                                "{t.message}"
                            </p>
                        </div>

                        {/* Author Info */}
                        <div className="mt-10 pt-4">
                            <p className="text-xl sm:text-2xl text-gray-900 font-['Rock_Salt',cursive] leading-snug tracking-wide uppercase">
                                {t.name}{t.location ? `, ${t.location}` : ''}
                            </p>
                            {t.role && (
                                <p className="text-xs sm:text-sm text-gray-400 font-normal mt-2 tracking-wide">
                                    {t.role}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsShowcase;