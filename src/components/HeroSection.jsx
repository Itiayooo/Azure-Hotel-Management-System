import React from "react";
import Navbar from "../components/Navbar";
import HeroSearchBox from "./HeroSearchBox";
import heroImage from "../assets/hero-image.jpg";

const HeroSection = () => {
    return (
        <div className="pt-0 px-0">
            <div
                className="w-full min-h-screen bg-black rounded-[0px] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black/45 rounded-[20px]" />

                {/* 1. Navbar */}
                <div className="relative z-20">
                    <Navbar />
                </div>

                {/* 2. Main Content */}
                <div className="relative z-10 px-6 pt-12 pb-8 md:px-16 lg:px-20 max-w-7xl">
                    <h1 className="text-white text-3xl font-medium tracking-wide max-w-3xl leading-tight md:text-5xl lg:text-[56px] lg:leading-[1.15] font-['Mona_Sans']">
                        Experience <br />
                        Comfort, Luxury, <br />
                        and Serenity
                    </h1>

                    <p className="text-white/80 text-sm font-light mt-4 leading-snug max-w-2xl md:text-base md:mt-6 font-['Mona_Sans']">
                        Escape the ordinary and indulge in a refined stay where world-class
                        amenities, exceptional service, and breathtaking surroundings come
                        together to create unforgettable memories whether you're here for
                        business, romance, or relaxation.
                    </p>
                </div>

                {/* 3. Search Box Sitting Inside Container */}
                <div className="relative z-30 px-6 pb-8 md:px-16 lg:px-20">
                    <HeroSearchBox />
                </div>
            </div>
            <br />
            <br />
        </div>
    );
};

export default HeroSection;