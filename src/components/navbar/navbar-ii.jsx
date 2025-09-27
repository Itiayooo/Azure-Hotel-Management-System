import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/GrandAzure Logo.png'
import './navbar-ii.css'

const NavbarII = () => {

    const navigate = useNavigate()

    return (             
        <nav className="navbar">
            <div className="logo"><img src={logo} alt="" /></div>
            <ul className="nav-links">
                <li><a onClick={() => navigate("/homepage") }>Home</a></li>
                <li><a onClick={() => navigate("/about-page") }>About Us</a></li>
                <li><a onClick={() => navigate("/contact-page") }>Contact</a></li>
                <li><a onClick={() => navigate("/about-page") }>Rooms</a></li>
            </ul>
        </nav>        
        

    )
}

export default NavbarII
