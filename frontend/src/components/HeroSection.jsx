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
                className="w-full min-h-screen bg-black bg-cover bg-center relative flex flex-col justify-between"
                style={{ backgroundImage: `url(${heroImage})` }}
            >                               
                <div className="absolute inset-0 bg-black/45 z-0" />
                                
                <div className="relative z-20 w-full">
                    <Navbar />
                </div>
                                
                <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 md:px-12 lg:px-20">
                    {centerContent ? (
                        
                        <div className="max-w-3xl text-center mx-auto">
                            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium tracking-wide leading-tight lg:leading-[1.15] font-['Mona_Sans']">
                                {title}
                            </h1>

                            <p className="text-white/80 text-sm sm:text-base font-light mt-4 md:mt-6 leading-relaxed max-w-2xl mx-auto font-['Mona_Sans']">
                                {description}
                            </p>
                        </div>
                    ) : (
                        
                        <div className="w-full max-w-7xl mx-auto text-center lg:text-left">
                            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium tracking-wide max-w-3xl leading-tight lg:leading-[1.15] font-['Mona_Sans'] mx-auto lg:mx-0">
                                {title}
                            </h1>

                            <p className="text-white/80 text-sm sm:text-base font-light mt-4 md:mt-6 leading-relaxed max-w-2xl font-['Mona_Sans'] mx-auto lg:mx-0">
                                {description}
                            </p>
                        </div>
                    )}
                </div>
                                
                {showSearch && (
                    <div className="relative z-30 w-full pb-8 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
                        <HeroSearchBox />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSection;