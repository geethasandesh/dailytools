import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="sticky top-4 z-50 flex justify-center w-full">
      <nav className="px-6 py-3 flex justify-between items-center text-white bg-white/30 backdrop-blur-md rounded-full shadow-lg w-full max-w-4xl transition-transform duration-300">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-lg flex items-center space-x-2">
          <span className="text-2xl">🛠️</span>
          <span>Daily Tools</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/tools" className="px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm font-medium">
          <span className="mr-2">⚡</span>Tools
        </Link>
        <Link to="/about" className="px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm font-medium">
          <span className="mr-2">ℹ️</span>About
        </Link>
      </div>
      </nav>
    </div>
  );
};

export default Navbar;
