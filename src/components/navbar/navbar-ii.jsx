import React from 'react'
import logo from '../../assets/GrandAzure Logo.png'
import './navbar-ii.css'

const NavbarII = () => {
    return (
        <nav className="navbar">
            <div className="logo"><img src={logo} alt="" /></div>
            <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Rooms</a></li>
            </ul>
        </nav>

    )
}

export default NavbarII
