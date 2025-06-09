import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

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
          <select
            id="template-select"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={templateName}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">Select a template</option>
            <option value="Meeting Invitation">Meeting Invitation</option>
            <option value="Birthday Wish">Birthday Wish</option>
            <option value="Thank You">Thank You</option>
            <option value="Custom">Custom Message</option>
          </select>
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