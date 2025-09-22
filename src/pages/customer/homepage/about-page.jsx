import React from 'react'
import { useNavigate } from 'react-router-dom'
import './about-page.css'
import NavbarII from '../../../components/navbar/navbar-ii'

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
        </div>
    )
}

export default AboutPage
