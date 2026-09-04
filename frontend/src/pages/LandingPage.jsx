import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import WelcomeSection from '../sections/WelcomeSection'
import heroImage from '../assets/hero-image.jpg'

const LandingPage = () => {
  return (
    <div>
      {/* <Navbar /> */}

      <HeroSection
        heroImage={heroImage}
        title={
          <>
            Experience <br />
            Comfort, Luxury, <br />
            and Serenity
          </>
        }
        description="Escape the ordinary and indulge in a refined stay where world-class amenities, exceptional service, and breathtaking surroundings come together to create unforgettable memories whether you're here for business, romance, or relaxation."
        showSearch={true}
      />

      <WelcomeSection />
    </div>
  )
}

export default LandingPage