import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/GrandAzure Logo.png';

const Navbar = ({ className }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center py-[15px] px-[50px] text-white font-['Mona_Sans'] z-[9999]">
      <div className="flex items-center gap-[10px]">
        <Link to="/">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-[157px] h-[75px]" 
          />
        </Link>
      </div>

      <div className="flex justify-between items-center w-[50%]">
        <ul className="flex list-none gap-[30px] m-0 p-0">
          <li>
            <Link 
              to="/" 
              className="text-white no-underline text-[16px] relative hover:underline"
            >
              Home
            </Link>
          </li>

          <li>
            <Link 
              to="/about" 
              className="text-white no-underline text-[16px] relative hover:underline"
            >
              About Us
            </Link>
          </li>

          <li>
            <Link 
              to="/contact" 
              className="text-white no-underline text-[16px] relative hover:underline"
            >
              Contact
            </Link>
          </li>

          <li>
            <Link 
              to="/gallery" 
              className="text-white no-underline text-[16px] relative hover:underline"
            >
              Rooms
            </Link>
          </li>
        </ul>

        <div className="flex items-center justify-center gap-[15px] h-[8%]">
          <button 
            className="border border-white bg-transparent text-white py-[8px] px-[15px] rounded-[20px] cursor-pointer m-0 hover:bg-white hover:text-black transition-colors"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button 
            className="bg-[#b68b47] text-white py-[8px] px-[15px] rounded-[20px] border-none cursor-pointer m-0 hover:bg-[#a37739] transition-colors"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;