import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/GrandAzure Logo.png';
import { useGoogleLogin } from '@react-oauth/google';


import welcomeImageI from "../assets/welcome-image-i.png";
import welcomeImageII from "../assets/welcome-image-ii.png";
import welcomeImageIII from "../assets/welcome-image-iii.png";
import welcomeImageIV from "../assets/welcome-image-iv.png";
import welcomeImageV from "../assets/welcome-image-v.png";
import welcomeImageVI from "../assets/welcome-image-vi.png";

const galleryImages = [
  { id: 1, src: welcomeImageI, alt: "Lobby view 1" },
  { id: 2, src: welcomeImageII, alt: "Lobby view 2" },
  { id: 3, src: welcomeImageIII, alt: "Lounge interior" },
  { id: 4, src: welcomeImageIV, alt: "Luxury sitting area" },
  { id: 5, src: welcomeImageV, alt: "Restaurant space" },
  { id: 6, src: welcomeImageVI, alt: "Bathroom suite" }
];

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
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
      const res = await fetch('https://azure-hotel-management-system.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Safely check for JSON response body
      const contentType = res.headers.get('content-type');
      let data = {};

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error: ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || 'Login failed');

      authLogin(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/rooms');
    } catch (err) {
      setError(err.message);
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Google sign-in failed');
          return;
        }

        authLogin(data.user, data.token);
        navigate(data.user.role === 'admin' ? '/admin' : '/rooms');
      } catch (err) {
        setError('Something went wrong with Google sign-in.');
      }
    },
    onError: () => setError('Google sign-in failed'),
  });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F7F7] font-['Mona_Sans']">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between px-8 md:px-16 lg:px-24 py-10 bg-[#F7F7F7]">
        <div>
          <Link to="/">
            <img src={logo} alt="Grand Azure" className="w-32 h-auto object-contain mb-12" />
          </Link>

          <h1 className="text-3xl font-medium text-[#1A1A1A] mb-1">Welcome to The Grand Azure</h1>
          <p className="text-sm text-[#737373] mb-8 font-light">Sign into your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#737373] font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-5 py-3.5 rounded-full border border-[#D9D9D9] bg-transparent text-sm text-black focus:outline-none focus:border-[#8C6D3B] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#737373] font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3.5 rounded-full bg-[#EAEAEA] border-none text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#8C6D3B] transition-all pr-12"
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

            <div className="flex items-center justify-between text-xs text-[#737373] mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-gray-300 accent-[#8C6D3B]" />
                Remember Me
              </label>
              <Link to="/forgot-password" className="hover:underline text-[#737373]">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#8C6D3B] hover:bg-[#75592e] text-white text-sm font-medium transition-colors shadow-md mt-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative flex py-6 items-center max-w-md">
            <div className="flex-grow border-t border-[#E5E5E5]"></div>
            <span className="flex-shrink mx-4 text-xs text-[#A3A3A3] font-medium">OR</span>
            <div className="flex-grow border-t border-[#E5E5E5]"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#E5E5E5] bg-white text-xs text-[#525252] font-medium hover:bg-gray-50 transition-colors cursor-pointer w-full"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

          </div>
        </div>

        <div className="text-center md:text-left mt-8 max-w-md">
          <p className="text-xs text-[#737373]">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#8C6D3B] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Showcase Section */}
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
            Log in to access your reservations, manage your bookings, and enjoy a seamless stay at Grand Azure.
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

export default Login;