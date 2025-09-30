import React from 'react'
import NavbarII from '../../../components/navbar/navbar-ii'
import contactImage from '../../../assets/contact-image.png'
import Footer from '../../../components/footer/footer.jsx'
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
                <div className='contact-left'>
                    <h1>We're here to help you every every step of the way.</h1>
                    <br />
                    <p>Have a question about your stay, a reservation, or our services? Our team is available 24/7 to assist you.</p>

                    <div className='contact-left-footer-container'>
                        <div className="contact-left-footer-column">
                            <div className="contact-left-footer-heading">Address</div>
                            <div className="contact-left-footer-text">
                                Grand Azure Hotel, 123 Seaview Boulevard,<br />
                                Coastal City, Country
                            </div>
                        </div>

                        <div className="contact-left-footer-column">
                            <div className="contact-left-footer-heading">Phone</div>
                            <div className="contact-left-footer-text">+123 456 7890</div>
                        </div>

                        <div className="contact-left-footer-column">
                            <div className="contact-left-footer-heading">Email</div>
                            <div className="contact-left-footer-text">info@grandazurehotel.com</div>
                        </div>

                        <div class="contact-left-footer-column">
                            <div class="contact-left-footer-heading">Socials</div>
                            <div class="contact-left-footer-socials">
                                <img src="https://img.icons8.com/ios-filled/50/twitterx--v2.png" alt="X" />
                                <img src="https://img.icons8.com/ios-filled/50/instagram-new.png" alt="Instagram" />
                                <img src="https://img.icons8.com/ios-filled/50/linkedin.png" alt="LinkedIn" />
                                <img src="https://img.icons8.com/ios-filled/50/facebook-new.png" alt="Facebook" />
                            </div>
                        </div>
                    </div>

                </div>
                <div className='contact-right'>
                    <div className="contact-form-container">
                        <form>
                            <div className="contact-form-row">
                                <div className="contact-form-field">
                                    <label for="first-name">First name</label>
                                    <input type="text" id="first-name" name="first-name" />
                                </div>
                                <div className="contact-form-field">
                                    <label for="last-name">Last name</label>
                                    <input type="text" id="last-name" name="last-name" />
                                </div>
                            </div>

                            <div className="contact-form-row">
                                <div className="contact-form-field">
                                    <label for="email">Email Addres</label>
                                    <input type="email" id="email" name="email" />
                                </div>
                                <div className="contact-form-field">
                                    <label for="contact">Contact Number</label>
                                    <input type="tel" id="contact" name="contact" />
                                </div>
                            </div>

                            <div className="contact-form-row">
                                <div className="contact-form-field-full">
                                    <label for="enquiry">Your Enquiry</label>
                                    <input type="text" />
                                </div>
                            </div>

                            <div className="contact-form-button">
                                <button type="submit" className="contact-form-submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Footer />




        </div>
    )
}

export default ContactPage
