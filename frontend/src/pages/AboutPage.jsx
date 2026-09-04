import React from "react";
import HeroSection from "../components/HeroSection";
import aboutHero from "../assets/about-hero.jpg";
import AboutSection from "../sections/AboutSection";
import ExperienceSection from "../sections/ExperienceSection";
import Footer from "../components/Footer";

const AboutUs = () => {
    return (
        <div>
            <HeroSection
                heroImage={aboutHero}
                title="More than a hotel, a place to belong"
                description="Our story is built on connection, comfort, and exceptional service"
                showSearch={false}
                centerContent={true}
            />
            <AboutSection />
            <ExperienceSection />
            <Footer />
        </div>
    );
};

export default AboutUs;