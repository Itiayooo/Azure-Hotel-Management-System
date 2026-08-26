import React from "react";
import HeroSection from "../components/HeroSection";
import aboutHero from "../assets/about-hero.jpg";

const AboutUs = () => {
    return (
        <HeroSection
            heroImage={aboutHero}
            title="More than a hotel, a place to belong"
            description="Our story is built on connection, comfort, and exceptional service"
            showSearch={false}
            centerContent={true}
        />
    );
};

export default AboutUs;