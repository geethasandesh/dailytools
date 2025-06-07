import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';

const UrlQrGenerator = () => {
  const [url, setUrl] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: url || ' ',
      dotsOptions: {
        type: dotStyle,
      },
      backgroundOptions: {
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 0,
      },
    });
  }, []);

  // Update QR code on URL, color, or style changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: url || ' ',
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {
        },
      });
    }
  }, [url, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'qrcode_url',
        extension: 'png',
      });
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Generate URL QR Code</h2>

        <div className="mb-6">
          <label htmlFor="url-input" className="block text-lg font-medium mb-2">Enter URL:</label>
          <input
            type="text"
            id="url-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="e.g., https://www.google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {url && (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div>
                <label htmlFor="dot-style-select" className="block text-base font-medium mb-1">Dot Style:</label>
                <select
                  id="dot-style-select"
                  className="w-32 h-10 p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white cursor-pointer"
                  value={dotStyle}
                  onChange={(e) => setDotStyle(e.target.value)}
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                </select>
              </div>
            </div>
            <div id="qr-code-container" ref={qrCodeRef} className="p-4 bg-white rounded-lg shadow-lg"></div>

            <button
              onClick={downloadQrCode}
              className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              Download QR Code
            </button>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Note: This QR code will work as long as the entered URL remains active.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlQrGenerator; 