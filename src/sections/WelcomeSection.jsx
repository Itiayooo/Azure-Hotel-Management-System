import React from "react";
import welcomeImageI from "../assets/welcome-image-i.png";
import welcomeImageII from "../assets/welcome-image-ii.png";
import welcomeImageIII from "../assets/welcome-image-iii.png";
import welcomeImageIV from "../assets/welcome-image-iv.png";
import welcomeImageV from "../assets/welcome-image-V.png";
import welcomeImageVI from "../assets/welcome-image-Vi.png";

const galleryImages = [
    { id: 1, src: welcomeImageI, alt: "Lobby view 1" },
    { id: 2, src: welcomeImageII, alt: "Lobby view 2" },
    { id: 3, src: welcomeImageIII, alt: "Lounge interior" },
    { id: 4, src: welcomeImageIV, alt: "Luxury sitting area" },
    { id: 5, src: welcomeImageV, alt: "Restaurant space" },
    { id: 6, src: welcomeImageVI, alt: "Bathroom suite" },
];

const WelcomeSection = () => {
    return (
        <section className="text-center py-[40px] px-[20px] font-sans">
            <div className="inline-block relative">
                <span className="absolute -top-3 -left-5 text-lg font-bold text-gray-800 leading-none select-none">
                    \\\
                </span>

                <h2 className="text-[32px] font-medium mb-[10px]">
                    Welcome To Serenity
                </h2>
            </div>

            <p className="text-[16px] text-[#666] mb-[30px] max-w-[600px] mx-auto">
                    Experience comfort and elegance like never before, with spaces designed for relaxation and luxury.
            </p>

            {/* Grid: 3-on-top-3 vertical portrait cards on mobile, exact w-[60%] and h-[220px] on desktop */}
            <div className="w-full lg:w-[60%] grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-[20px] mx-auto justify-center">
                {galleryImages.map((image) => (
                    <img
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        className="w-full aspect-[4/5] lg:aspect-auto lg:h-[220px] object-cover rounded-[14px] lg:rounded-[12px]"
                    />
                ))}
            </div>
        </section>
    );
};

export default WelcomeSection;