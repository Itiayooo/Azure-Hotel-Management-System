import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/GrandAzure Logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

  const formatName = (name) => {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // .map((word) => word.toUpperCase())
      .join(' ');
  };

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

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Settings', path: '/settings' },
  ];

  // Reusable Hamburger Component for consistent styling
  const HamburgerButton = () => (
    <button
      onClick={toggleMenu}
      aria-label="Toggle navigation menu"
      className="lg:hidden z-50 w-8 h-8 border border-white/40 rounded-full flex flex-col items-center justify-center gap-0.5 bg-black/20 backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer p-0 shrink-0"
    >
      <span
        className={`w-3.5 h-[1px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4px]' : ''
          }`}
      />
      <span
        className={`w-3.5 h-[1px] bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''
          }`}
      />
      <span
        className={`w-3.5 h-[1px] bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4px]' : ''
          }`}
      />
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[99999] w-full font-['Mona_Sans']">
      {/* ----------------- LOGGED IN LAYOUT ----------------- */}
      {user ? (
        <div className="pt-4 px-4 flex flex-col items-center">
          <nav className="w-full max-w-[477px] h-[46.5px] bg-[#5E5C5C75] backdrop-blur-md rounded-full px-5 flex items-center justify-between shadow-lg border border-white/10 relative z-50">
            {/* Logo */}
            <Link to="/" onClick={closeMenu} className="flex items-center">
              <img
                src={logo}
                alt="Grand Azure Logo"
                className="w-16 md:w-20 h-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center">
              <ul className="flex list-none gap-5 m-0 p-0 items-center">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name} className="relative flex flex-col items-center">
                      <Link
                        to={link.path}
                        className={`text-white no-underline text-xs transition-colors duration-200 ${isActive ? 'font-medium' : 'opacity-80 hover:opacity-100'
                          }`}
                      >
                        {link.name}
                      </Link>
                      {isActive && (
                        <span className="absolute -bottom-1.5 w-4 h-[2px] bg-white rounded-full transition-all duration-300" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Hamburger */}
            <HamburgerButton />
          </nav>

          {/* User Greeting Pill */}
          <div className="mt-2 flex items-center gap-2 py-0.5 px-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-md relative z-50">
            <span className="text-[11px] font-medium text-white/90">
              Hello, <span className="text-[#b68b47] font-semibold">{formatName(user.name)}</span>
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
        </div>
      ) : (
        /* ----------------- LOGGED OUT LAYOUT ----------------- */
        <nav className="relative z-50 w-full flex justify-between items-center py-4 px-6 md:px-12 bg-gradient-to-b from-black/60 via-black/20 to-transparent backdrop-blur-[2px] text-white">
          <Link to="/" onClick={closeMenu}>
            <img
              src={logo}
              alt="Grand Azure Logo"
              className="w-[120px] md:w-[140px] h-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            <ul className="flex list-none gap-8 m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-xs uppercase tracking-widest transition-all duration-300 hover:text-[#b68b47] ${location.pathname === link.path
                      ? 'text-[#b68b47] font-semibold'
                      : 'text-white/80'
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-xs tracking-wider uppercase text-white/90 hover:text-white px-4 py-2 rounded-full border border-white/20 hover:border-white/60 backdrop-blur-sm transition-all cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/register')}
                className="text-xs tracking-wider uppercase bg-[#b68b47] hover:bg-[#9e7639] text-white px-5 py-2 rounded-full shadow-lg transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <HamburgerButton />
        </nav>
      )}

      {/* ----------------- MOBILE MENU OVERLAY ----------------- */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#0d0c0b]/90 backdrop-blur-xl z-40 flex flex-col justify-between pt-28 pb-10 px-8 transition-all duration-500 ease-in-out ${isOpen
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
                  className={`text-2xl font-light no-underline tracking-wide transition-colors duration-200 block ${location.pathname === link.path
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
          {user ? (
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
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  closeMenu();
                  navigate('/login');
                }}
                className="flex-1 text-xs tracking-wider uppercase text-white/90 hover:text-white py-3 rounded-full border border-white/20 hover:border-white/60 backdrop-blur-sm transition-all cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  navigate('/register');
                }}
                className="flex-1 text-xs tracking-wider uppercase bg-[#b68b47] hover:bg-[#9e7639] text-white py-3 rounded-full shadow-lg transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-white/40">
              Grand Azure Luxury Hotel & Suites
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;