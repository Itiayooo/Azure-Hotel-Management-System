import React from 'react'
import NavbarII from '../../../components/navbar/navbar-ii'
import contactImage from '../../../assets/contact-image.png'
import './contact-page.css'
import { useNavigate } from 'react-router-dom'

const ContactPage = () => {

    const Navigate = useNavigate()

    return (
        <div>            
            <div className='contact-hero'>
                <NavbarII />                
            </div>

            <div className='contact-main'>
                <div className='contact-main'>

                </div>
                <div></div>
            </div>
        </div>
    )
}

export default ContactPage
