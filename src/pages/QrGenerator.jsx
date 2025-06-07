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
      path: '#',
      type: 'simple',
    },
    {
      name: 'Email',
      icon: '📧',
      path: '#',
      type: 'simple',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      path: '#',
      type: 'simple',
    },
    {
      name: 'Location',
      icon: '📍',
      path: '#',
      type: 'simple',
    },
    {
      name: 'Text',
      icon: '📝',
      path: '#',
      type: 'simple',
    },
    {
      name: 'Instagram',
      icon: '📸',
      path: '#',
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
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">
        QR Code Generator
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {qrTypes.map((qrType) => (
          <Link
            key={qrType.name}
            to={qrType.path}
            className={`relative flex flex-col items-center justify-between p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-blue-400
              ${qrType.type === 'phone-mockup' ? 'min-h-[300px] row-span-2 flex-col justify-center' : 'h-40 flex-row items-center'}
            `}
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-4xl">{qrType.icon}</span>
                <h3 className="text-lg font-semibold text-white">
                  {qrType.name}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400 text-sm">?</span>
                <span className="text-purple-600 text-xl font-bold">→</span>
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
