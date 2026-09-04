import React from 'react'
import HeroSection from '../components/HeroSection'
import heroImage from "../assets/contact-image.png"
import HelpSection from '../sections/HelpSection'
import Footer from '../components/Footer'

const ContactPage = () => {
  return (
    <div>
        <HeroSection heroImage={heroImage}/>
        <HelpSection />
        <Footer />
    </div>
  )
}

export default ContactPage