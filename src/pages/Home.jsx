// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import Tools from './Tools'; // Import the Tools component
import Features from './Features';
import Stats from './Stats';
import Footer from '../components/Footer'; // Import the Footer component

const Home = () => {
  // Removed the 'tools' array as it's now handled by Tools.jsx

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-0 flex flex-col lg:flex-row items-center justify-center min-h-screen">
        {/* Left Section - Text Content */}
        <div className="lg:w-1/2 text-white text-center lg:text-left mb-12 lg:mb-0 lg:pr-12 p-4 lg:pl-12">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-wide">
            Unlock Top  <br /> Daily Tools <br /> One Click Away!
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
            <h2 className="text-5xl md:text-7xl font-bold">8</h2>
            <p className="text-xl md:text-2xl text-purple-200">Daily Tools</p>
          </div>

          {/* Stars Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="star star-1"></div>
            <div className="star star-2"></div>
            <div className="star star-3"></div>
            <div className="star star-4"></div>
            <div className="star star-5"></div>
            <div className="star star-6"></div>
            <div className="star star-7"></div>
            <div className="star star-8"></div>
            <div className="star star-9"></div>
            <div className="star star-10"></div>
            <div className="star star-11"></div>
            <div className="star star-12"></div>
            <div className="star star-13"></div>
            <div className="star star-14"></div>
            <div className="star star-15"></div>
          </div>

          {/* Orbital Lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 border border-white border-opacity-25 rounded-full animate-spin-slow"></div>
            <div className="absolute w-96 h-96 border border-white border-opacity-20 rounded-full animate-spin-slow-reverse delay-1000"></div>
            <div className="absolute w-[500px] h-[500px] border border-white border-opacity-15 rounded-full animate-spin-slow delay-2000"></div>
          </div>

          {/* Orbiting Tools - Inner Ring (3 tools) */}
          <div className="absolute w-64 h-64 animate-spin-slow">
            <Link to="/tools/image-background-remover" className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>🖼️</Link>
            <Link to="/tools/video-to-mp3" className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-green-500/30 to-teal-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}>🎵</Link>
            <Link to="/tools/unit-converter" className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-500/30 to-pink-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>📊</Link>
          </div>
          
          {/* Middle Ring (3 tools) */}
          <div className="absolute w-96 h-96 animate-spin-slow-reverse delay-1000">
            <Link to="/tools/image-compressor" className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-orange-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>🗜️</Link>
            <Link to="/tools/qr-generator" className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>🔗</Link>
            <Link to="/tools/gradient-generator" className="absolute top-1/2 -left-10 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>🎨</Link>
          </div>
          
          {/* Outer Ring (2 tools) */}
          <div className="absolute w-[500px] h-[500px] animate-spin-slow delay-2000">
            <Link to="/tools/code-formatter" className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-emerald-500/30 to-green-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>⚡</Link>
            <Link to="/tools/color-palette-generator" className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-rose-500/30 to-red-600/30 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)' }}>🎨</Link>
          </div>
        </div>
      </div>
      {/* Render additional sections */}
      <Features />
      <Stats />
      <Tools />
      <Footer />
    </div>
  );
};

export default Home;
