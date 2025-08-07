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

const WhatsAppQrGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  const messageTemplates = {
    'Meeting Invitation': 'Hi! I would like to invite you to a meeting on {date} at {time}. Please let me know if you can make it.',
    'Birthday Wish': 'Happy Birthday! 🎉 Wishing you a day filled with happiness and joy!',
    'Thank You': 'Thank you for your help! I really appreciate it.',
    'Custom': message
  };

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: generateWhatsAppUrl(),
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

  const generateWhatsAppUrl = () => {
    if (!phoneNumber && !isGroup) return ' ';
    
    let baseUrl = 'https://wa.me/';
    const params = new URLSearchParams();
    
    if (isGroup) {
      baseUrl = 'https://chat.whatsapp.com/';
      if (groupName) {
        params.append('group', encodeURIComponent(groupName));
      }
    } else {
      baseUrl += phoneNumber;
    }

    if (message) {
      params.append('text', encodeURIComponent(message));
    }

    if (scheduledTime) {
      params.append('scheduled', scheduledTime);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Update QR code on any changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: generateWhatsAppUrl(),
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {},
      });
    }
  }, [phoneNumber, message, isGroup, groupName, scheduledTime, templateName, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'whatsapp_qrcode',
        extension: 'png',
      });
    }
  };

  const handleTemplateChange = (template) => {
    setTemplateName(template);
    if (template !== 'Custom') {
      setMessage(messageTemplates[template]);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced WhatsApp QR Generator</h2>

        <div className="mb-6">
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span className="text-lg">Create Group Chat</span>
          </label>

          {!isGroup ? (
            <div>
              <label htmlFor="phone-input" className="block text-lg font-medium mb-2">Phone Number:</label>
              <input
                type="tel"
                id="phone-input"
                className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
                placeholder="e.g., 911234567890 (with country code)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              />
              <p className="mt-1 text-sm text-gray-300">Enter the phone number with country code</p>
            </div>
          ) : (
            <div>
              <label htmlFor="group-name-input" className="block text-lg font-medium mb-2">Group Name:</label>
              <input
                type="text"
                id="group-name-input"
                className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="template-select" className="block text-lg font-medium mb-2">Message Template:</label>
          <Select
            options={[
              { value: '', label: 'Select a template' },
              { value: 'Meeting Invitation', label: 'Meeting Invitation' },
              { value: 'Birthday Wish', label: 'Birthday Wish' },
              { value: 'Thank You', label: 'Thank You' },
              { value: 'Custom', label: 'Custom Message' },
            ]}
            value={{ value: templateName, label: templateName || 'Select a template' }}
            onChange={(selectedOption) => handleTemplateChange(selectedOption.value)}
            styles={customSelectStyles}
            placeholder="Select a template"
            isSearchable={false}
            isClearable={false}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message-input" className="block text-lg font-medium mb-2">Message:</label>
          <textarea
            id="message-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="scheduled-time-input" className="block text-lg font-medium mb-2">Schedule Message (Optional):</label>
          <input
            type="datetime-local"
            id="scheduled-time-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>

        {(phoneNumber || (isGroup && groupName)) && (
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
              {isGroup 
                ? 'Scan this QR code to join the WhatsApp group.'
                : 'Scan this QR code to start a WhatsApp chat with the specified number.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppQrGenerator; 