// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import Tools from './Tools'; // Import the Tools component
import Footer from '../components/Footer'; // Import the Footer component

const Home = () => {
  // Removed the 'tools' array as it's now handled by Tools.jsx

  return (
    <div className="relative min-h-screen overflow-hidden bg-radial-gradient">
      {/* Hero Content */}
      <div className="relative z-0 flex flex-col lg:flex-row items-center justify-center min-h-screen">
        {/* Left Section - Text Content */}
        <div className="lg:w-1/2 text-white text-center lg:text-left mb-12 lg:mb-0 lg:pr-12 p-4 lg:pl-12">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-wide">
            Unlock Top <GlitchText>Daily Tools</GlitchText> <br /> Now Just One <br /> Click Away!
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8">
            Your complete toolkit for everyday tasks, powered by modern technology.
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center px-8 py-4 bg-purple-700 text-white rounded-full font-semibold text-lg hover:bg-purple-600 transition-colors shadow-lg"
          >
            Start Using Tools <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Right Section - Orbital Elements */}
        <div className="relative w-full lg:w-1/2 h-96 md:h-[500px] flex items-center justify-center p-4">
          {/* Central Element */}
          <div className="relative z-10 text-white text-center">
            <h2 className="text-5xl md:text-7xl font-bold">14+</h2>
            <p className="text-xl md:text-2xl text-purple-200">Daily Tools</p>
          </div>

          {/* Orbital Lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 border border-purple-500 border-opacity-30 rounded-full animate-spin-slow"></div>
            <div className="absolute w-96 h-96 border border-purple-500 border-opacity-20 rounded-full animate-spin-slow-reverse delay-1000"></div>
            <div className="absolute w-[500px] h-[500px] border border-purple-500 border-opacity-10 rounded-full animate-spin-slow delay-2000"></div>
          </div>

          {/* Static Decorative Orbital Elements (removed tool links) */}
          <div 
            className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full text-4xl text-white"
            style={{
              transform: `translate(-150px, -50px)`,
              boxShadow: '0 0 10px 3px rgba(173, 216, 230, 0.5), 0 0 20px 8px rgba(173, 216, 230, 0.3)',
            }}
          >
            🔗
          </div>
          <div
            className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl text-4xl text-white"
            style={{
              transform: `translate(100px, 120px)`,
              boxShadow: '0 0 10px 3px rgba(173, 216, 230, 0.5), 0 0 20px 8px rgba(173, 216, 230, 0.3)',
            }}
          >
            🎵
          </div>
          <div
            className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full text-4xl text-white"
            style={{
              transform: `translate(-200px, 100px)`,
              boxShadow: '0 0 10px 3px rgba(173, 216, 230, 0.5), 0 0 20px 8px rgba(173, 216, 230, 0.3)',
            }}
          >
            🎥
          </div>
          <div
            className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl text-4xl text-white"
            style={{
              transform: `translate(180px, -150px)`,
              boxShadow: '0 0 10px 3px rgba(173, 216, 230, 0.5), 0 0 20px 8px rgba(173, 216, 230, 0.3)',
            }}
          >
            📱
          </div>
        </div>
      </div>
      {/* Render the Tools component below the hero section */}
      <Tools />
      {/* Render the Footer component only on the Home page */}
      <Footer />
    </div>
  );
};

export default Home;
