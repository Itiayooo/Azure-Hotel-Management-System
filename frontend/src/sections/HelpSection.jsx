import React from 'react';

const HelpSection = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24 font-['Mona_Sans'] text-[#1E1E1E]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
        <div className="lg:col-span-5 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#1E1E1E] leading-[1.2]">
              We’re here to help you every step of the way.
            </h2>
            <p className="text-[#808080] text-sm md:text-base font-normal leading-relaxed max-w-md">
              Have a question about your stay, a reservation, or our services? Our team is available 24/7 to assist you.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
            {/* Address */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#282828]">Address</h3>
              <p className="text-sm text-[#808080] leading-snug">
                Grand Azure Hotel, 123 Seaview Boulevard, Coastal City, Country
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#282828]">Phone</h3>
              <p className="text-sm text-[#808080]">+123 456 7890</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#282828]">Email</h3>
              <a
                href="mailto:info@grandazurehotel.com"
                className="text-sm text-[#808080] hover:text-[#282828] transition-colors block"
              >
                info@grandazurehotel.com
              </a>
            </div>

            {/* Socials */}
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#282828]">Socials</h3>
              <div className="flex items-center gap-4 text-[#808080] pt-1">
                {/* X / Twitter */}
                <a href="#" className="hover:text-[#282828] transition-colors" aria-label="X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="hover:text-[#282828] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="hover:text-[#282828] transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" className="hover:text-[#282828] transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-7 bg-[#F3F0EC] p-6 sm:p-10 rounded-2xl">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#808080]">
                  First name
                </label>
                <input
                  type="text"
                  className="w-full bg-white px-4 py-3 rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#808080] shadow-sm transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#808080]">
                  Last name
                </label>
                <input
                  type="text"
                  className="w-full bg-white px-4 py-3 rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#808080] shadow-sm transition-shadow"
                />
              </div>
            </div>

            {/* Email Address & Contact Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#808080]">
                  Email Addres
                </label>
                <input
                  type="email"
                  className="w-full bg-white px-4 py-3 rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#808080] shadow-sm transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-normal text-[#808080]">
                  Contact Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-white px-4 py-3 rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#808080] shadow-sm transition-shadow"
                />
              </div>
            </div>

            {/* Your Enquiry */}
            <div className="space-y-2">
              <label className="block text-sm font-normal text-[#808080]">
                Your Enquiry
              </label>
              <textarea
                rows={6}
                className="w-full bg-white p-4 rounded-lg text-sm text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#808080] shadow-sm transition-shadow resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#896D43] hover:bg-[#725935] text-white font-normal px-8 py-3 rounded-xl text-sm transition-colors duration-200"
              >
                Submit
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};

export default HelpSection;