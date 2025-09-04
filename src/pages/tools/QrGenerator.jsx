import React from 'react';
import { Link } from 'react-router-dom';

const QrGenerator = () => {
  const qrTypes = [
    {
      name: 'URL / Link',
      icon: '🔗',
      path: '/qr-generator/url',
      type: 'simple',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      path: '/qr-generator/youtube',
      type: 'simple',
    },
    {
      name: 'Email',
      icon: '📧',
      path: '/qr-generator/email',
      type: 'simple',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      path: '/qr-generator/whatsapp',
      type: 'simple',
    },
    {
      name: 'Location',
      icon: '📍',
      path: '/qr-generator/location',
      type: 'simple',
    },
    {
      name: 'Text',
      icon: '📝',
      path: '/qr-generator/text',
      type: 'simple',
    },
    {
      name: 'Instagram',
      icon: '📸',
      path: '/qr-generator/instagram',
      type: 'simple',
    },
  ];

  const PhoneMockup = ({ content }) => (
    <div className="w-40 h-64 bg-white rounded-xl shadow-lg flex flex-col items-center justify-start p-2 border border-gray-200 mt-4 mx-auto">
      <div className="w-10 h-1 bg-gray-300 rounded-full mb-2"></div>
      <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
      {/* Placeholder for dynamic content */}
      <p className="text-gray-400 text-xs text-center">{content}</p>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          QR Code Generator
        </h1>
        <p className="text-base text-purple-200">
          Generate QR codes for various purposes
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {qrTypes.map((qrType) => (
          <Link
            key={qrType.name}
            to={qrType.path}
            className="relative flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{qrType.icon}</span>
                <h3 className="text-base font-medium text-white">
                  {qrType.name}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-purple-300 text-lg">→</span>
              </div>
            </div>
            {qrType.type === 'phone-mockup' && (
              <PhoneMockup content={qrType.mockupContent} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QrGenerator;
