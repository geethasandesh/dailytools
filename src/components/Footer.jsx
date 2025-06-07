import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const allTools = [
    { name: 'QR Code Generator', path: '/qr-generator' },
    { name: 'Video to MP3', path: '/video-to-mp3' },
    { name: 'YouTube to MP3', path: '/yt-to-mp3' },
    { name: 'Reels Downloader', path: '/reels-downloader' },
    { name: 'Image Background Remover', path: '/image-background-remover' },
    { name: 'Image Compressor', path: '/image-compressor' },
    { name: 'PDF to Word', path: '/pdf-to-word' },
    { name: 'Resume Builder', path: '/resume-builder' },
    { name: 'Text to Speech', path: '/text-to-speech' },
    { name: 'Speech to Text', path: '/speech-to-text' },
    { name: 'Code Formatter', path: '/code-formatter' },
    { name: 'Color Palette Generator', path: '/color-palette-generator' },
    { name: 'Unit Converter', path: '/unit-converter' },
    { name: 'Todo List', path: '/todo-list' },
  ];

  return (
    <footer className="bg-black text-white py-5 mt-auto">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Daily Tools</h3>
            <p className="text-gray-400 text-sm">
              Your comprehensive suite of online tools for everyday tasks.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/tools" className="text-gray-400 hover:text-white transition-colors">All Tools</Link></li>
              {/* Add other general links like About, Contact, etc. if needed */}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {allTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-0 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Daily Tools. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 