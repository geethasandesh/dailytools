import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 flex justify-between items-center 
                    text-black bg-white/30 backdrop-blur-md rounded-[32px] shadow-md w-[90%] max-w-[2000px] transition-transform duration-300 ${
                      showNavbar ? 'translate-y-0' : '-translate-y-full'
                    }`}>
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-lg">Daily Tools</Link>
      </div>
      <div className="space-x-2">
        <Link to="/login" className="px-3 py-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors text-sm">
          Log In
        </Link>
        <Link to="/join-now" className="bg-white text-purple-800 px-3 py-1 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
          Join Now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
