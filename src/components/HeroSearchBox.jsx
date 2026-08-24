import React from "react";

// Helper component for search inputs
const SearchInputWrapper = ({ label, icon, children }) => (
  <div className="flex-1 min-w-[200px] flex flex-col gap-1.5 px-6 py-4 border-r border-gray-100 last:border-r-0 md:py-2 md:px-5">
    <div className="flex items-center gap-2 text-sm text-black font-normal">
      {icon}
      <span>{label}</span>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

const SelectArrow = () => (
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const HeroSearchBox = () => {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-3 max-w-[90%] md:max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center">
      
      {/* Location */}
      <SearchInputWrapper
        label="Location"
        icon={<i className="fi fi-rr-marker text-lg text-black"></i>}
      >
        <input
          type="text"
          placeholder="Type Location"
          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500 placeholder-gray-400 focus:ring-1 focus:ring-brown-500 outline-none"
        />
      </SearchInputWrapper>

      {/* Person */}
      <SearchInputWrapper
        label="Person"
        icon={<i className="fi fi-rr-user text-lg text-black"></i>}
      >
        <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500 appearance-none focus:ring-1 focus:ring-brown-500 outline-none">
          <option>Person</option>
          <option>1 Adult</option>
          <option>2 Adults</option>
        </select>
        <SelectArrow />
      </SearchInputWrapper>

      {/* Check-In */}
      <SearchInputWrapper
        label="Check-In"
        icon={<i className="fi fi-rr-calendar-lines-pen text-lg text-black"></i>}
      >
        <input
          type="text"
          placeholder="Date"
          onFocus={(e) => (e.target.type = "date")}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500 placeholder-gray-400 focus:ring-1 focus:ring-brown-500 outline-none"
        />
        <SelectArrow />
      </SearchInputWrapper>

      {/* Check-Out */}
      <SearchInputWrapper
        label="Check-Out"
        icon={<i className="fi fi-rr-calendar-lines-pen text-lg text-black"></i>}
      >
        <input
          type="text"
          placeholder="Date"
          onFocus={(e) => (e.target.type = "date")}
          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-500 placeholder-gray-400 focus:ring-1 focus:ring-brown-500 outline-none"
        />
        <SelectArrow />
      </SearchInputWrapper>

      {/* Search Button */}
      <div className="flex items-center justify-center pt-4 pb-2 md:pt-0 md:pb-0 md:px-5">
        <button
          type="submit"
          className="w-full md:w-auto bg-[#8D734B] hover:bg-[#7a6441] transition-colors text-white font-medium text-base px-16 py-4 rounded-lg shadow-md"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HeroSearchBox;