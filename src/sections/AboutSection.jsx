import React from 'react';
import aboutSectionImage from "../assets/about_section.jpg";

export default function AboutSection() {
  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-24 text-[#1E1E1E] font-['Mona_Sans']">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#282828] mb-3">
            About Us
          </h2>
          <p className="text-[#808080] text-sm md:text-base leading-relaxed font-normal">
            Discover a sanctuary where coastal luxury meets authentic comfort. We design every detail to turn your stay into a memorable escape.
          </p>
        </div>
        
        {/* Content & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text (7 cols out of 12) */}
          <div className="lg:col-span-7 space-y-4 leading-relaxed text-base">
            <p>
              At Grand Azure, we believe in more than just accommodation — we create 
              unforgettable experiences. Nestled in a serene coastal location, our hotel 
              blends elegant design, warm hospitality, and world-class service to offer a 
              stay that&apos;s as relaxing as it is refined.
            </p>

            <p>
              Whether you&apos;re visiting for leisure or business, our thoughtfully curated 
              spaces, exceptional amenities, and attention to detail ensure your comfort 
              from check-in to check-out. From ocean-view suites to signature dining and 
              personalized guest services, Grand Azure is where timeless luxury meets 
              modern ease.
            </p>

            <p className="italic font-medium text-[#282828] pt-1">
              Come experience the art of hospitality – only at Grand Azure.
            </p>
          </div>

          {/* Right Column: Fixed Image Size (5 cols out of 12) */}
          <div className="lg:col-span-5 w-full max-w-[450px] mx-auto">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-md">
              <img
                src={aboutSectionImage}
                alt="Grand Azure Hotel Pool Area"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}