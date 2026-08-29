import React from 'react';
import logo from "../assets/logo-ii.png"
// import logo from "../assets/GrandAzureLogo.jpg"

const Footer = () => {
  return (
    <footer className="relative bg-[#59482B] text-white font-['Mona_Sans'] overflow-hidden">      
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M500 400 L950 -50 L1400 400"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <path
            d="M750 400 L1200 -50 L1650 400"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <path
            d="M1000 400 L1250 150 L1500 400"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
                    
          <div className="md:col-span-5 space-y-6 max-w-md">            
            <div className="flex items-center gap-3">              
              <div className="logo-container">
                <img src={logo} alt="Grand Azure Logo" className="h-12 w-auto" />
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-[#E0D8CC] leading-relaxed font-light">
              Escape the ordinary and indulge in a refined stay where world-class
              amenities, exceptional service, and breathtaking surroundings
              come together to create unforgettable memories whether you're
              here for business, romance, or relaxation.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5 pt-2">
              
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="X">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              
              <a href="#" className="hover:opacity-75 transition-opacity" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-base font-medium text-white mb-4">Contact</h3>
            <div className="space-y-3 text-xs md:text-sm text-[#E0D8CC] font-light">
              <div>
                <p>Email:</p>
                <a href="mailto:info@grandazurehotel.com" className="underline hover:text-white">
                  info@grandazurehotel.com
                </a>
              </div>
              <p>+234 8034 334 111</p>
              <p>+234 8034 334 111</p>
              <p>+234 8034 334 111</p>
              <p className="pt-2">Address: Plot 153, Jericho G.R.A</p>
            </div>
          </div>
          
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-base font-medium text-white mb-4">Newsletter</h3>
            <p className="text-xs md:text-sm text-[#E0D8CC] font-light leading-relaxed">
              Subscribe to our email newsletter to receive updates and news.
            </p>

            {/* Input Box */}
            <div className="pt-2">
              <div className="flex items-center border border-[#8C7A5C] bg-[#4D3E24] rounded-sm overflow-hidden focus-within:border-white transition-colors">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 text-xs bg-transparent text-white placeholder-[#B5A58D] focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Submit Newsletter"
                  className="bg-[#6E5B3A] border-l border-[#8C7A5C] px-3 py-2 flex items-center justify-center hover:bg-[#856F48] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      
      <div className="bg-[#FFC000] py-3 text-center px-4">
        <p className="text-xs font-medium text-[#1E1E1E]">
          Copyright © 2025, Grandazure, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;