import React from 'react'
import logo from '../../assets/GrandAzure Logo.png'
import './navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = ({className}) => {
    const navigate = useNavigate();

    return (
        <nav className={`navbar ${className || ''}`}>
            <div className="navbar-logo">
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <div className='nav-right'>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#gallery">Gallery</a></li>
                </ul>

                <div className="nav-buttons">
                    <button className="btn-outline" onClick={() => navigate("/login")}>Sign In</button>
                    <button className="btn-filled" onClick={()=> navigate("/signup")}>Register</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar
