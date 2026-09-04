import React from 'react';

const HeroSearchBox = () => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl w-full text-[#1E1E1E] font-['Mona_Sans']">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
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
              placeholder="Type Location"
              className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl text-xs sm:text-sm text-[#1E1E1E] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#896D43]"
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
            <select className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none cursor-pointer">
              <option value="">Person</option>
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="3+">3+ Persons</option>
            </select>
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
              className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl text-xs sm:text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none"
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
              className="w-full bg-[#F5F5F5] px-4 py-3 rounded-xl text-xs sm:text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#896D43] appearance-none"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#896D43] hover:bg-[#725935] text-white font-normal py-3 rounded-xl text-sm transition-colors duration-200"
          >
            Search
          </button>
        </div>

      </form>
    </div>
  );
};

export default HeroSearchBox;