import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import Select from 'react-select';

// Custom styles for react-select to make it transparent
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgb(147 197 253)', // border-blue-300
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 2px rgb(59 130 246)' : 'none', // focus:ring-blue-500
    '&:hover': {
      border: '1px solid rgb(147 197 253)',
    },
    backdropFilter: 'blur(4px)',
    minHeight: '40px',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(147, 197, 253, 0.5)',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'rgba(59, 130, 246, 0.9)' 
      : state.isFocused 
        ? 'rgba(59, 130, 246, 0.5)' 
        : 'transparent',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.7)',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(147, 197, 253, 0.5)',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(147, 197, 253, 0.8)',
    '&:hover': {
      color: 'rgb(147, 197, 253)',
    },
  }),
};

const TextQrGenerator = () => {
  const [text, setText] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: text || ' ',
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

  // Update QR code on text or style changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: text || ' ',
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {},
      });
    }
  }, [text, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'text_qrcode',
        extension: 'png',
      });
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Generate Text QR Code</h2>

        <div className="mb-6">
          <label htmlFor="text-input" className="block text-lg font-medium mb-2">Enter Text:</label>
          <textarea
            id="text-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="Enter any text you want to encode"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
          />
        </div>

        {text && (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div>
                <label htmlFor="dot-style-select" className="block text-base font-medium mb-1">Dot Style:</label>
                <Select
                  options={[
                    { value: 'square', label: 'Square' },
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'dots', label: 'Dots' },
                    { value: 'classy', label: 'Classy' },
                    { value: 'classy-rounded', label: 'Classy Rounded' },
                    { value: 'extra-rounded', label: 'Extra Rounded' },
                  ]}
                  value={{ value: dotStyle, label: dotStyle.charAt(0).toUpperCase() + dotStyle.slice(1).replace('-', ' ') }}
                  onChange={(selectedOption) => setDotStyle(selectedOption.value)}
                  styles={customSelectStyles}
                  placeholder="Select dot style"
                  isSearchable={false}
                  isClearable={false}
                  className="w-32"
                />
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
              Scan this QR code to read the encoded text.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextQrGenerator; 