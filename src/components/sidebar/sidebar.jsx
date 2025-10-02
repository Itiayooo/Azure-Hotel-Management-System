import React from 'react'
import logo from '../../assets/logo-ii.png'
import { NavLink } from "react-router-dom";
import './sidebar.css'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-container'>
                <div className='sidebar-container-child-i'>
                    <div><img src={logo} alt="" /></div>

                    <div>
                        <ul>
                            <li><NavLink to="/">Dashboard</NavLink></li>
                            <li><NavLink to="/rooms">Rooms</NavLink></li>
                            <li><NavLink to="/guests">Guests</NavLink></li>
                            <li><NavLink to="/reservations">Reservations</NavLink></li>
                        </ul>
                    </div>
                </div>

                <div>
                    <button className='sidebar-log-out'>Log Out</button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
