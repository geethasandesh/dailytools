import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            About Daily Tools
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Your one-stop solution for everyday digital tasks, designed to make your life easier and more productive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🚀 Our Mission</h2>
            <p className="text-gray-300">
              To provide powerful, easy-to-use tools that help you accomplish daily digital tasks without the need for multiple apps or complex software.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⚡ Why Choose Us</h2>
            <p className="text-gray-300">
              Fast, secure, and completely free tools that work directly in your browser. No downloads, no sign-ups, just instant results.
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🛠️ Available Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl mb-2">🖼️</div>
              <p className="text-white text-xs">Background Remover</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🎵</div>
              <p className="text-white text-xs">Video to MP3</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">📊</div>
              <p className="text-white text-xs">Unit Converter</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🗜️</div>
              <p className="text-white text-xs">Image Compressor</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🔗</div>
              <p className="text-white text-xs">QR Generator</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🎨</div>
              <p className="text-white text-xs">Gradient Generator</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">⚡</div>
              <p className="text-white text-xs">Code Formatter</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-2">🎨</div>
              <p className="text-white text-xs">Color Palette</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          <a
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Tools <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;