import React from 'react';
import experienceImageI from "../assets/learn-more-i.png";
import experienceImageII from "../assets/learn-more-iI.png";
import experienceImageIII from "../assets/learn-more-iii.png";

const ExperienceSection = () => {
  const features = [
    {
      id: 1,
      image: experienceImageI,
      alt: "Resort Pool and Villa",
    },
    {
      id: 2,
      image: experienceImageII,
      alt: "Oceanview Cabanas at Sunset",
    },
    {
      id: 3,
      image: experienceImageIII,
      alt: "Tropical Pool Area",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24 font-['Mona_Sans']">
      <div className="max-w-6xl mx-auto">
        {/* Header Grid (Top Aligned) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#282828] leading-tight max-w-xl">
            Where Hospitality <br className="hidden sm:inline" />
            Becomes An Experience
          </h2>

          {/* Subtitle (Aligned to top) */}
          <p className="text-[#808080] text-sm md:text-base font-normal max-w-xs md:text-right leading-relaxed pt-1">
            Learn more about what makes your stay with us truly unforgettable.
          </p>
        </div>

        {/* 3-Column Image Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;