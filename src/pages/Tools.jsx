import React from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const allTools = [
    { name: 'QR Code Generator', path: '/qr-generator', icon: '🔗', description: 'Generate QR codes for various purposes.' },
    { name: 'Video to MP3', path: '/video-to-mp3', icon: '🎵', description: 'Convert video files to MP3 audio.' },
    { name: 'YouTube to MP3', path: '/yt-to-mp3', icon: '🎥', description: 'Download YouTube videos as MP3 audio.' },
    { name: 'Reels Downloader', path: '/reels-downloader', icon: '📱', description: 'Download reels from popular social media platforms.' },
    { name: 'Image Background Remover', path: '/image-background-remover', icon: '🖼️', description: 'Remove backgrounds from your images instantly.' },
    { name: 'Image Compressor', path: '/image-compressor', icon: '📸', description: 'Compress images to reduce file size without losing quality.' },
    { name: 'PDF to Word', path: '/pdf-to-word', icon: '📄', description: 'Convert PDF documents to editable Word files.' },
    { name: 'Resume Builder', path: '/resume-builder', icon: '📝', description: 'Create professional resumes quickly and easily.' },
    { name: 'Text to Speech', path: '/text-to-speech', icon: '🔊', description: 'Convert text into natural-sounding speech.' },
    { name: 'Speech to Text', path: '/speech-to-text', icon: '🎤', description: 'Transcribe spoken words into text.' },
    { name: 'Code Formatter', path: '/code-formatter', icon: '💻', description: 'Format code for various programming languages.' },
    { name: 'Color Palette Generator', path: '/color-palette-generator', icon: '🎨', description: 'Generate beautiful color palettes for your designs.' },
    { name: 'Unit Converter', path: '/unit-converter', icon: '📏', description: 'Convert between different units of measurement.' },
    { name: 'Todo List', path: '/todo-list', icon: '✅', description: 'Manage your tasks and stay organized.' },
  ];

  return (
    <div className="min-h-screen bg-radial-gradient py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-white mb-12">
          Explore Our Daily Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allTools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="block bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 text-blue-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-300 text-sm">
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