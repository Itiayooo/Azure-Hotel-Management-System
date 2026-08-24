import React from "react";
import welcomeImageI from "../assets/welcome-image-i.png";
import welcomeImageII from "../assets/welcome-image-ii.png";
import welcomeImageIII from "../assets/welcome-image-iii.png";
import welcomeImageIV from "../assets/welcome-image-iv.png";
import welcomeImageV from "../assets/welcome-image-V.png";
import welcomeImageVI from "../assets/welcome-image-Vi.png";


// Assuming your imports are at the top:
// import welcomeImageI from "../assets/welcome-1.jpg";
// ...

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
        // <section className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 font-['Mona_Sans']">
        //   {/* Top Header & Subtitle */}
        //   <div className="text-center max-w-xl mx-auto mb-10 md:mb-12">
        //     <div className="inline-block relative">
        //       <span className="absolute -top-3 -left-5 text-lg font-bold text-gray-800 leading-none select-none">
        //         \\\
        //       </span>
        //       <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
        //         Welcome To Serenity
        //       </h2>
        //     </div>

        //     <p className="text-gray-500 text-xs md:text-sm font-normal leading-relaxed mt-3">
        //       Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
        //       inceptos himenaeos. per inceptos himenaeos.
        //     </p>
        //   </div>

        //   {/* Grid with Taller Middle Column Images */}
        //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-center">
        //     {galleryImages.map((image, index) => {
        //       // Check if this is image 2 or 5 (index 1 or 4) to make it taller
        //       const isMiddleColumn = index === 1 || index === 4;

        //       return (
        //         <div
        //           key={image.id}
        //           className={`w-full bg-gray-200 rounded-2xl overflow-hidden shadow-sm relative group ${
        //             isMiddleColumn 
        //               ? "aspect-[3/4.2]"  /* Taller vertical height for 2nd and 5th */
        //               : "aspect-[4/3]"    /* Standard landscape height for 1st, 3rd, 4th, 6th */
        //           }`}
        //         >
        //           {image.src ? (
        //             <img
        //               src={image.src}
        //               alt={image.alt}
        //               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        //             />
        //           ) : (
        //             <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4">
        //               <span className="material-symbols-outlined text-2xl mb-1">
        //                 image
        //               </span>
        //               <span className="text-xs font-medium">Slot {image.id}</span>
        //             </div>
        //           )}
        //         </div>
        //       );
        //     })}
        //   </div>
        // </section>
        <section className="text-center py-[40px] px-[20px] font-sans">
            <div className="inline-block relative">
                <span className="absolute -top-3 -left-5 text-lg font-bold text-gray-800 leading-none select-none">
                    \\\
                </span>
                <h2 className="text-[32px] font-medium mb-[10px]">Welcome To Serenity</h2>
            </div>
            <p className="text-[16px] text-[#666] mb-[30px] max-w-[600px] mx-auto">
                Experience comfort and elegance like never before, with spaces designed for relaxation and luxury.
            </p>

            <div className="w-[60%] grid grid-cols-3 gap-[20px] mx-auto justify-center">
                <img src={welcomeImageI} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
                <img src={welcomeImageII} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
                <img src={welcomeImageIII} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
                <img src={welcomeImageIV} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
                <img src={welcomeImageV} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
                <img src={welcomeImageVI} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
            </div>
        </section>
    );
};

export default WelcomeSection;