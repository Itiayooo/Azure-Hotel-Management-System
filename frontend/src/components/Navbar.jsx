import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/GrandAzure Logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

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
    <nav className="fixed top-4 left-0 right-0 z-[999999] w-full flex flex-col items-center px-4 font-['Mona_Sans']">
      {/* Capsule Container: Scaled down by 40% (~477px W x ~46.5px H) */}
      <div 
        className="w-full max-w-[477px] h-[46.5px] bg-[#5E5C5C75] backdrop-blur-md rounded-full px-5 flex items-center justify-between shadow-lg border border-white/10"
      >
        {/* Brand Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center">
          <img
            src={logo}
            alt="Grand Azure Logo"
            className="w-16 md:w-20 h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <ul className="flex list-none gap-5 m-0 p-0 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name} className="relative flex flex-col items-center">
                  <Link
                    to={link.path}
                    className={`text-white no-underline text-xs transition-colors duration-200 ${
                      isActive ? 'font-medium' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {/* Bottom Active Indicator Pill */}
                  {isActive && (
                    <span className="absolute -bottom-1.5 w-4 h-[2px] bg-white rounded-full transition-all duration-300" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Authentication Buttons (when logged out) */}
        {!user && (
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="border border-white/80 bg-transparent text-white py-1 px-2.5 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-300 text-[10px] font-medium"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="bg-[#b68b47] text-white py-1 px-2.5 rounded-full border-none cursor-pointer hover:bg-[#a37739] transition-all duration-300 text-[10px] font-medium shadow-md"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden z-50 w-7 h-7 border border-white/40 rounded-full flex flex-col items-center justify-center gap-0.5 bg-black/20 backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer p-0"
        >
          <span
            className={`w-3 h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-[4px]' : ''
            }`}
          ></span>
          <span
            className={`w-3 h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`w-3 h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-[4px]' : ''
            }`}
          ></span>
        </button>
      </div>

      {/* Centered User Greeting Below Nav (Logged In) */}
      {user && (
        <div className="mt-2 flex items-center gap-2 py-0.5 px-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-md">
          <span className="text-[11px] font-medium text-white/90">
            Hello, <span className="text-[#b68b47] font-semibold">{user.name}</span>
          </span>
          <span className="text-white/30 text-[10px]">|</span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-[10px] text-white/70 hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#0d0c0b]/95 backdrop-blur-xl z-40 flex flex-col justify-between pt-28 pb-10 px-8 transition-all duration-500 ease-in-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#b68b47] font-semibold">
            Navigation
          </p>

          <ul className="flex flex-col list-none gap-5 m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-xl font-light no-underline tracking-wide transition-colors duration-200 block ${
                    location.pathname === link.path
                      ? 'text-[#b68b47] font-normal'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
          {!user ? (
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-[#b68b47] text-white py-3 rounded-full border-none cursor-pointer font-medium hover:bg-[#a37739] active:scale-[0.98] transition-all text-xs"
                onClick={() => {
                  closeMenu();
                  navigate('/register');
                }}
              >
                Register
              </button>

              <button
                className="w-full border border-white/30 bg-white/5 text-white py-3 rounded-full cursor-pointer font-medium hover:bg-white/10 active:scale-[0.98] transition-all text-xs"
                onClick={() => {
                  closeMenu();
                  navigate('/login');
                }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              className="w-full border border-red-500/50 bg-red-500/10 text-red-200 py-3 rounded-full cursor-pointer font-medium hover:bg-red-500/20 active:scale-[0.98] transition-all text-xs"
              onClick={() => {
                closeMenu();
                logout();
                navigate('/');
              }}
            >
              Logout ({user.name})
            </button>
          )}

          <div className="text-center">
            <p className="text-[10px] text-white/40">Grand Azure Luxury Hotel & Suites</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;