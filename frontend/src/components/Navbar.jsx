import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/GrandAzure Logo.png';

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Rooms', path: '/rooms' },
  ];

  return (
    <nav className="relative flex justify-between items-center py-5 px-6 md:px-12 text-white font-['Mona_Sans'] z-[9999] w-full">
      {/* Brand Logo */}
      <div className="flex items-center gap-[10px] z-50">
        <Link to="/" onClick={closeMenu}>
          <img 
            src={logo} 
            alt="Grand Azure Logo" 
            className="w-[130px] h-[60px] md:w-[157px] md:h-[75px] object-contain transition-transform duration-300 hover:scale-[1.02]" 
          />
        </Link>
      </div>
      
      <div className="hidden lg:flex justify-between items-center w-[60%] lg:w-[50%]">
        <ul className="flex list-none gap-[30px] m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`text-white no-underline text-[16px] relative py-1 transition-colors duration-200 hover:text-[#b68b47] ${
                  location.pathname === link.path ? 'font-medium text-[#b68b47]' : 'opacity-90'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-[15px]">
          <button 
            className="border border-white/80 bg-transparent text-white py-[8px] px-[18px] rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button 
            className="bg-[#b68b47] text-white py-[8px] px-[18px] rounded-full border-none cursor-pointer hover:bg-[#a37739] transition-all duration-300 text-sm font-medium shadow-md shadow-[#b68b47]/20"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </div>
    
      <button 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        className="lg:hidden z-50 w-11 h-11 border border-white/70 rounded-full flex flex-col items-center justify-center gap-[5px] bg-black/20 backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer p-0"
      >
        <span className={`w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}></span>
        <span className={`w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}></span>
      </button>
      
      <div 
        className={`lg:hidden fixed inset-0 bg-[#0d0c0b]/90 backdrop-blur-xl z-40 flex flex-col justify-between pt-28 pb-10 px-8 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        
        <div className="flex flex-col gap-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b68b47] font-semibold">Navigation</p>
          <ul className="flex flex-col list-none gap-5 m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  onClick={closeMenu}
                  className={`text-2xl font-light no-underline tracking-wide transition-colors duration-200 block ${
                    location.pathname === link.path ? 'text-[#b68b47] font-normal' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col gap-3">
            <button 
              className="w-full bg-[#b68b47] text-white py-3.5 rounded-full border-none cursor-pointer font-medium hover:bg-[#a37739] active:scale-[0.98] transition-all shadow-lg shadow-[#b68b47]/20 text-sm"
              onClick={() => {
                closeMenu();
                navigate("/signup");
              }}
            >
              Register
            </button>

            <button 
              className="w-full border border-white/30 bg-white/5 text-white py-3.5 rounded-full cursor-pointer font-medium hover:bg-white/10 active:scale-[0.98] transition-all text-sm"
              onClick={() => {
                closeMenu();
                navigate("/login");
              }}
            >
              Sign In
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-white/40">Grand Azure Luxury Hotel & Suites</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;