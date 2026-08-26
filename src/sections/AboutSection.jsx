import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 font-['Mona_Sans']">
            About Us
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-['Mona_Sans']">
            Discover a sanctuary where coastal luxury meets authentic comfort. We design every detail to turn your stay into a memorable escape.
          </p>
        </div>

        {/* Content & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div className="space-y-6 text-gray-600 leading-relaxed text-base font-['Mona_Sans']">
            <p className="font-['Mona_Sans']">
              At Grand Azure, we believe in more than just accommodation — we create 
              unforgettable experiences. Nestled in a serene coastal location, our hotel 
              blends elegant design, warm hospitality, and world-class service to offer a 
              stay that&apos;s as relaxing as it is refined.
            </p>

            <p className="font-['Mona_Sans']">
              Whether you&apos;re visiting for leisure or business, our thoughtfully curated 
              spaces, exceptional amenities, and attention to detail ensure your comfort 
              from check-in to check-out. From ocean-view suites to signature dining and 
              personalized guest services, Grand Azure is where timeless luxury meets 
              modern ease.
            </p>

            <p className="italic font-medium text-gray-800 pt-2 font-['Mona_Sans']">
              Come experience the art of hospitality – only at Grand Azure.
            </p>
          </div>

          {/* Right Column: Image Placeholder */}
          <div className="w-full h-[350px] sm:h-[450px] relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://via.placeholder.com/600x450?text=Replace+With+Your+Image"
              alt="Grand Azure Hotel Pool Area"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}