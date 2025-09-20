import { useNavigate } from 'react-router-dom'
import React from 'react'
import './homepage.css'
import welcomeImageI from '../../../assets/welcome-image-i.png'
import welcomeImageII from '../../../assets/welcome-image-ii.png'
import welcomeImageIII from '../../../assets/welcome-image-iii.png'
import welcomeImageIV from '../../../assets/welcome-image-iv.png'
import welcomeImageV from '../../../assets/welcome-image-v.png'
import welcomeImageVI from '../../../assets/welcome-image-vi.png'
import Navbar from '../../../components/navbar/navbar'
import NavbarII from '../../../components/navbar/navbar-ii'
import amazingImageI from '../../../assets/amazing-room-i.jpg'
import amazingImageII from '../../../assets/amazing-room-ii.jpg'
import amazingImageIII from '../../../assets/amazing-room-iii.jpg'
import roomsListI from '../../../assets/rooms-list-i.png'
import roomsListII from '../../../assets/rooms-list-ii.png'
import roomsListIII from '../../../assets/rooms-list-iii.png'
import roomsListIV from '../../../assets/rooms-list-iv.png'
import roomsListV from '../../../assets/rooms-list-v.png'
import roomsListVI from '../../../assets/rooms-list-vi.png'
import Footer from '../../../components/footer/footer'


const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className='landing-page'>
            <div className='hero-section'>
                <div className='hero-content'>
                    <NavbarII/>                    
                    <h1>Experience Comfort, Luxury, and Serenity</h1>
                    <p>Escape the ordinary and indulge in a refined stay where world-class amenities, exceptional service, and breathtaking surroundings come together to create unforgettable memories whether you're here for business, romance, or relaxation.</p>

                    <div className="search-box">
                        <div className="search-item">
                            <label><i className="fas fa-map-marker-alt"></i> Location</label>
                            <input type="text" placeholder="Type Location" />
                        </div>

                        <div className="search-item">
                            <label><i className="fas fa-user"></i> Person</label>
                            <select>
                                <option>Person</option>
                                <option>1 Person</option>
                                <option>2 People</option>
                                <option>3+ People</option>
                            </select>
                        </div>

                        <div className="search-item">
                            <label><i className="fas fa-calendar-alt"></i> Check-In</label>
                            <input type="date" />
                        </div>

                        <div className="search-item">
                            <label><i className="fas fa-calendar-alt"></i> Check-Out</label>
                            <input type="date" />
                        </div>

                        <button className="search-btn">Search</button>
                    </div>

                    <br />
                    <br />
                </div>
            </div>

            <section className="gallery-section">
                <h2 className="gallery-title">Welcome To Serenity</h2>
                <p className="gallery-subtitle">
                    Experience comfort and elegance like never before, with spaces designed for relaxation and luxury.
                </p>

                <div className="gallery-grid">
                    <img src={welcomeImageI} alt="Room" />
                    <img src={welcomeImageII} alt="Room" />
                    <img src={welcomeImageIII} alt="Room" />
                    <img src={welcomeImageIV} alt="Room" />
                    <img src={welcomeImageV} alt="Room" />
                    <img src={welcomeImageVI} alt="Room" />
                </div>
            </section>

            <section className="amazing-rooms-section">
                <h2 className="amazing-title">Our Most Amazing Visited Room In 2025</h2>                
                <p className="amazing-description">
                    Discover our most luxurious and highly rated rooms designed to offer ultimate comfort and elegance.
                </p>

                <div className="amazing-grid">
                    <div className="amazing-card large-card">
                        <img src={amazingImageI} alt="Luxury Room" />
                        <div className="overlay">
                            <h4>Okazaki Stand, East Board</h4>
                            <p>Okazaki Stand, East Board ★★★★★</p>
                            <span className="arrow">➔</span>
                        </div>
                    </div>

                    <div className="small-card-container">
                        <div className="amazing-card small-card">
                            <img src={amazingImageII} alt="Luxury Room" />
                            <div className="overlay">
                                <h4>Okazaki Stand, East Board</h4>
                                <p>Okazaki Stand, East Board ★★★★★</p>
                                <span className="arrow">➔</span>
                            </div>
                        </div>
                        <div className="amazing-card small-card">
                            <img src={amazingImageIII} alt="Luxury Room" />
                            <div className="overlay">
                                <h4>Okazaki Stand, East Board</h4>
                                <p>Okazaki Stand, East Board ★★★★★</p>
                                <span className="arrow">➔</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rooms-list-container">
                <div class="rooms-list-header">
                    <h2>Explore Our Best Rooms List</h2>
                    <div class="rooms-list-search">
                        <p>Discover luxury and comfort in our exclusive collection of suites, designed to give you the perfect stay.</p>
                        <input type="text" placeholder='Find Rooms ' />
                    </div>
                </div>

                <div class="rooms-list-grid">

                    <div class="rooms-list-card">
                        <img src={roomsListI} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★☆</div>
                        </div>
                    </div>

                    <div class="rooms-list-card">
                        <img src={roomsListII} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★★</div>
                        </div>
                    </div>

                    <div class="rooms-list-card">
                        <img src={roomsListIII} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★★</div>
                        </div>
                    </div>

                    <div class="rooms-list-card">
                        <img src={roomsListIV} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★☆</div>
                        </div>
                    </div>

                    <div class="rooms-list-card">
                        <img src={roomsListV} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★☆</div>
                        </div>
                    </div>

                    <div class="rooms-list-card">
                        <img src={roomsListVI} alt="Luxury Room" />
                        <div class="rooms-list-info">
                            <h3>Presidential Suite</h3>
                            <p>Okazaki Stand, East Board</p>
                            <div class="rooms-list-stars">★★★★☆</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    )
}

export default Homepage
