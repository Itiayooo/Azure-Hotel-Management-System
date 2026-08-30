import React from 'react';
import logo from "../assets/GrandAzure Logo.png"
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] font-['Mona_Sans'] text-[#1E1E1E] relative overflow-hidden select-none">
      
      
      <nav className="w-full bg-white py-4 px-8 md:px-16 shadow-sm border-b border-gray-100 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center">          
          <div className="logo-container flex items-center">
            <img src={logo} alt="Grand Azure Logo" className="h-10 w-auto" />            
          </div>
        </Link>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-20">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* '404' Pill Badge */}
          <div className="inline-block bg-[#EDE9E3] text-[#6E6458] text-sm font-medium px-4 py-1.5 rounded-md">
            404
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#282828] tracking-tight">
            Oops! Page not found
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#808080] font-normal leading-relaxed max-w-sm mx-auto">
            We couldn’t find the page your are looking for. It might have been moved or doesn’t exist anymore
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#896D43] hover:bg-[#725935] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-md transition-colors duration-200"
            >
              <span>Back to homepage</span>
              <svg
                className="w-4 h-4 fill-current stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

        </div>
      </main>

      {/* Subtle Background Watermark Text at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center opacity-[0.04] overflow-hidden leading-none select-none">
        <span className="text-[18vw] font-black tracking-widest text-[#282828] uppercase whitespace-nowrap">
          GRAND AZURE
        </span>
      </div>

    </div>
  );
};

export default NotFound;