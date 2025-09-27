import React from 'react'
import { useNavigate } from 'react-router-dom'
import './about-page.css'
import NavbarII from '../../../components/navbar/navbar-ii'
import testImage from '../../../assets/hero-image.jpg'
import learnI from '../../../assets/learn-more-i.png'
import learnII from '../../../assets/learn-more-ii.png'
import learnIII from '../../../assets/learn-more-iii.png'
import Footer from '../../../components/footer/footer'

const AboutPage = () => {

    const navigate = useNavigate()

    return (
        <div>
            <div className='about-hero-section'>
                <div className='about-hero-content'>
                    <NavbarII />
                    <div className='about-hero-header'>
                        <div>
                            <h1>More Than a Hotel,<br /> A Place to Belong</h1>
                            <p>Our story is built on connection, comfort and exceptional service</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='about-us-section'>
                <h1>About Us</h1>
                <p>At Grand Azure, we provide comfort, luxury, and top-notch hospitality services to make every stay unforgettable.</p>
                <div className='about-us-section-i'>
                    <div className='about-description'>
                        <div >
                            At Grand Azure, we believe in more than justaccommodation - we create unforgettable experiences. Nestled in a serene coastal location, our hotel blends elegant design, warm hospitality and world class services to offer a stay that's as relxing as it is refined.
                            <br />
                            <br />
                            Whether you're visiting for leisure or business, our thoughtfully curated spaces, exceptional amenities and attention to detail ensure your comfort from check-in to check-out. From ocean-view suites to signature dining and personalized guest services, Grand Azure is where timeless luxury meets modern ease.
                            <br />
                            <br />
                            <span>Come experience the art of hospitality - only at Grand Azure.</span>
                        </div>
                    </div>
                    <div className='about-image'>
                        <img src={testImage} alt="" />
                    </div>
                </div>
            </div>

            <div className='learn-more'>
                <div className='learn-more-headers'>
                    <div className='learn-more-h-i'>
                        <h1>Where Hospitality Becomes An Experience</h1>
                    </div>
                    <h5 className='learn-more-h-ii'><div>Learn more about what makes your stay with us truly unforgettable</div></h5>
                </div>

                <div className='learn-images'>
                    <div>
                        <img src={learnI} alt="" />
                    </div>

                    <div>
                        <img src={learnII} alt="" />
                    </div>

                    <div>
                        <img src={learnIII} alt="" />
                    </div>
                </div>
            </div>


            <Footer />

        </div>
    )
}

export default AboutPage
