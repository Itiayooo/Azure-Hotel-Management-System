import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSearchBox = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}${guests ? `&guests=${guests}` : ''}`);
  };

  return (
    <div className="relative z-0 bg-white rounded-xl px-5 py-7 sm:px-6 sm:py-8 shadow-xl w-full text-[#1E1E1E] font-['Mona_Sans'] max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:items-end gap-4">
        
        {/* Fields Wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">

          {/* Location Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-normal text-[#282828]">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </label>
            <input
              type="text"
              value="Grand Azure Hotel"
              disabled
              className="w-full bg-[#F4F4F4] px-4 py-3.5 rounded-xl text-xs sm:text-sm text-gray-400 cursor-not-allowed outline-none"
            />
          </div>

          {/* Person Selection */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-normal text-[#282828]">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Person
            </label>
            <div className="relative">
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-[#F4F4F4] px-4 py-3.5 rounded-xl text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none cursor-pointer pr-10"
              >
                <option value="">Person</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3+ Persons</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Check-In Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-normal text-[#282828]">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#F4F4F4] px-4 py-3.5 rounded-xl text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none cursor-pointer"
            />
          </div>

          {/* Check-Out Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-normal text-[#282828]">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#F4F4F4] px-4 py-3.5 rounded-xl text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none cursor-pointer"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="w-full lg:w-auto lg:min-w-[140px]">
          <button
            type="submit"
            className="w-full bg-[#8C6D46] hover:bg-[#725935] text-white font-normal py-3.5 px-8 rounded-xl text-sm transition-colors duration-200"
          >
            Search
          </button>
        </div>

      </form>
    </div>
  );
};

export default HeroSearchBox;