import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

const LocationQrGenerator = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: latitude && longitude ? `geo:${latitude},${longitude}${locationName ? `?q=${encodeURIComponent(locationName)}` : ''}` : ' ',
      dotsOptions: {
        type: dotStyle,
      },
      backgroundOptions: {},
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 0,
      },
    });
  }, []);

  // Update QR code on location data or style changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: latitude && longitude ? `geo:${latitude},${longitude}${locationName ? `?q=${encodeURIComponent(locationName)}` : ''}` : ' ',
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {},
      });
    }
  }, [latitude, longitude, locationName, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'location_qrcode',
        extension: 'png',
      });
    }
  };

  const validateCoordinates = (lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    return !isNaN(latNum) && !isNaN(lngNum) &&
           latNum >= -90 && latNum <= 90 &&
           lngNum >= -180 && lngNum <= 180;
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Generate Location QR Code</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="latitude-input" className="block text-lg font-medium mb-2">Latitude:</label>
            <input
              type="number"
              id="latitude-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="e.g., 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
            />
          </div>
          <div>
            <label htmlFor="longitude-input" className="block text-lg font-medium mb-2">Longitude:</label>
            <input
              type="number"
              id="longitude-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="e.g., -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="location-name-input" className="block text-lg font-medium mb-2">Location Name (Optional):</label>
          <input
            type="text"
            id="location-name-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="e.g., Empire State Building"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>

        {latitude && longitude && validateCoordinates(latitude, longitude) && (
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
              Scan this QR code to open the location in maps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationQrGenerator; 