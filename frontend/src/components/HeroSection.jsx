import React from "react";
import Navbar from "../components/Navbar";
import HeroSearchBox from "./HeroSearchBox";

const HeroSection = ({
    heroImage,
    title,
    description,
    showSearch = false,
    centerContent = false,
}) => {
    return (
        <div className="w-full">
            <div
                className="w-full min-h-screen bg-black bg-cover bg-center relative flex flex-col justify-between pt-28 pb-6 sm:pt-32 sm:pb-12"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-0" />

                {/* Navbar */}
                <div className="relative z-[99999] w-full">
                    <Navbar />
                </div>

                {/* Hero Text Content */}
                <div className="relative z-10 flex-1 flex items-center justify-center py-6 px-5 sm:px-8 md:px-12 lg:px-20">
                    {centerContent ? (
                        <div className="max-w-3xl text-center mx-auto">
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-normal leading-[1.15] lg:leading-[1.15] font-['Mona_Sans']">
                                {title}
                            </h1>

                            <p className="text-white/85 text-[15px] sm:text-base font-light mt-4 md:mt-6 leading-relaxed max-w-xl mx-auto font-['Mona_Sans']">
                                {description}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full max-w-7xl mx-auto text-center lg:text-left">
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-normal max-w-3xl leading-[1.15] lg:leading-[1.15] font-['Mona_Sans'] mx-auto lg:mx-0">
                                {title}
                            </h1>

                            <p className="text-white/85 text-[15px] sm:text-base font-light mt-4 md:mt-6 leading-relaxed max-w-xl font-['Mona_Sans'] mx-auto lg:mx-0">
                                {description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Search Component */}
                {showSearch && (
                    <div className="relative z-10 w-full pb-4 sm:pb-8 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
                        <HeroSearchBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSection;