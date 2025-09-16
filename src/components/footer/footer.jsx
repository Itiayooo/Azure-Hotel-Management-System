import React from 'react'
import './footer.css'

const Footer = () => {
    return (
        <div>
            <footer class="footer-container">
                <div class="footer-row">
                    <div class="footer-left">
                        <h2>Grand Azure</h2>
                        <p>Escape the ordinary and indulge in a refined stay where world-class amenities, exceptional service, and breathtaking surroundings come together to create unforgettable memories whether you're here for business, romance, or relaxation.</p>
                        <div class="footer-socials">
                            <a href="#">✗</a>
                            <a href="#">📷</a>
                            <a href="#">💼</a>
                            <a href="#">📘</a>
                        </div>
                    </div>

                    <div class="footer-contact">
                        <h3>Contact</h3>
                        <p>Email: info@grandazurehotel.com</p>
                        <p>+234 8034 334 111</p>
                        <p>+234 8034 334 111</p>
                        <p>+234 8034 334 111</p>
                        <p>Address: Plot 153, Jericho G.R.A</p>
                    </div>

                    <div class="footer-newsletter">
                        <h3>Newsletter</h3>
                        <p>Subscribe to our email newsletter to receive updates and news.</p>
                        <form>
                            <input type="email" placeholder='Email address' name="" id="" />
                            <button type="submit">→</button>
                        </form>
                    </div>
                </div>

                <div class="footer-bottom">
                    Copyright © 2025, Grandazure. All Rights Reserved
                </div>
            </footer>
        </div>
    )
}

export default Footer
