import React from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const allTools = [
    { name: 'QR Code Generator', path: '/qr-generator', icon: '🔗', description: 'Generate QR codes for various purposes.' },
    { name: 'Video to MP3', path: '/video-to-mp3', icon: '🎵', description: 'Convert video files to MP3 audio.' },
    { name: 'Image Background Remover', path: '/image-background-remover', icon: '🖼️', description: 'Remove backgrounds from images using advanced AI models.' },
    { name: 'Image Compressor', path: '/image-compressor', icon: '📸', description: 'Compress images to reduce file size without losing quality.' },
    { name: 'PDF to Word', path: '/pdf-to-word', icon: '📄', description: 'Convert PDF documents to editable Word files.' },
    { name: 'Code Formatter', path: '/code-formatter', icon: '💻', description: 'Format code for various programming languages.' },
    { name: 'Color Palette Generator', path: '/color-palette-generator', icon: '🎨', description: 'Generate beautiful color palettes for your designs.' },
    { name: 'Unit Converter', path: '/unit-converter', icon: '📏', description: 'Convert between different units of measurement.' },
  ];

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Explore Our Daily Tools
          </h2>
          <p className="text-base text-purple-200">
            Choose from our collection of powerful, easy-to-use tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allTools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="block bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
            >
              <div className="p-5">
                <div className="text-2xl mb-3 group-hover:scale-105 transition-transform duration-200">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools; 