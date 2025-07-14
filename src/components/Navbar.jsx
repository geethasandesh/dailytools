import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 z-50 px-6 py-4 flex justify-between items-center text-black bg-white/30 backdrop-blur-md rounded-none shadow-md w-full max-w-[2000px] transition-transform duration-300">
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
