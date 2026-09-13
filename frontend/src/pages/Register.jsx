import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/GrandAzure Logo.png';

import welcomeImageI from "../assets/welcome-image-i.png";
import welcomeImageII from "../assets/welcome-image-ii.png";
import welcomeImageIII from "../assets/welcome-image-iii.png";
import welcomeImageIV from "../assets/welcome-image-iv.png";
import welcomeImageV from "../assets/welcome-image-V.png";
import welcomeImageVI from "../assets/welcome-image-Vi.png";

const galleryImages = [
    { id: 1, src: welcomeImageI, alt: "Lobby view 1" },
    { id: 2, src: welcomeImageII, alt: "Lobby view 2" },
    { id: 3, src: welcomeImageIII, alt: "Lounge interior" },
    { id: 4, src: welcomeImageIV, alt: "Luxury sitting area" },
    { id: 5, src: welcomeImageV, alt: "Restaurant space" },
    { id: 6, src: welcomeImageVI, alt: "Bathroom suite" }
];


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('azure_token', data.token);
            localStorage.setItem('azure_user', JSON.stringify(data.user));

            navigate('/rooms');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F7F7] font-['Mona_Sans']">
            {/* Left Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-between px-8 md:px-16 lg:px-24 py-10 bg-[#F7F7F7]">
                <div>
                    <Link to="/">
                        <img src={logo} alt="Grand Azure" className="w-32 h-auto object-contain mb-8" />
                    </Link>

                    <h1 className="text-3xl font-medium text-[#1A1A1A] mb-1">Create an Account</h1>
                    <p className="text-sm text-[#737373] mb-6 font-light">Join The Grand Azure experience</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-[#737373] font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-5 py-3 rounded-full border border-[#D9D9D9] bg-transparent text-sm text-black focus:outline-none focus:border-[#8C6D3B] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-[#737373] font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-5 py-3 rounded-full border border-[#D9D9D9] bg-transparent text-sm text-black focus:outline-none focus:border-[#8C6D3B] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-[#737373] font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+234 800 000 0000"
                                className="w-full px-5 py-3 rounded-full border border-[#D9D9D9] bg-transparent text-sm text-black focus:outline-none focus:border-[#8C6D3B] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-[#737373] font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    min="6"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    className="w-full px-5 py-3 rounded-full bg-[#EAEAEA] border-none text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#8C6D3B] transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-black cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17"
                                            height="17"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.72 7.45 7.6 5 12 5c4.4 0 8.28 2.45 9.94 6.65a1 1 0 0 1 0 .7C20.28 16.55 16.4 19 12 19c-4.4 0-8.28-2.45-9.94-6.65Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-full bg-[#8C6D3B] hover:bg-[#75592e] text-white text-sm font-medium transition-colors shadow-md mt-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                <div className="text-center md:text-left mt-6 max-w-md">
                    <p className="text-xs text-[#737373]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#8C6D3B] font-semibold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Visual Section */}
            <div className="hidden md:flex w-1/2 bg-white flex-col items-center justify-center p-12">
                <div className="w-full max-w-lg grid grid-cols-12 gap-3 mb-8">
                    <div className="col-span-7 h-48 bg-[#E5E5E5] rounded-2xl overflow-hidden flex items-center justify-center text-xs text-gray-400 font-medium">
                        <img src={welcomeImageI} alt={galleryImages[0].alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-5 h-48 bg-[#D4D4D4] rounded-2xl overflow-hidden flex items-center justify-center text-xs text-gray-400 font-medium">
                        <img src={welcomeImageII} alt={galleryImages[1].alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-8 h-40 bg-[#D4D4D4] rounded-2xl overflow-hidden flex items-center justify-center text-xs text-gray-400 font-medium">
                        <img src={welcomeImageIV} alt={galleryImages[2].alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-4 h-40 bg-[#E5E5E5] rounded-2xl overflow-hidden flex items-center justify-center text-xs text-gray-400 font-medium">
                        <img src={welcomeImageVI} alt={galleryImages[3].alt} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-center max-w-md">
                    <h2 className="text-xl font-medium text-[#1A1A1A] mb-2">Experience Luxury Redefined</h2>
                    <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6 font-light">
                        Create an account to unlock tailored recommendations, instant room reservations, and seamless check-ins.
                    </p>
                    <div className="flex justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D3B]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4]"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;