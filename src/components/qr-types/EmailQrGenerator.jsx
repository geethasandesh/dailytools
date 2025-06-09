import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

const EmailQrGenerator = () => {
  const [email, setEmail] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  const emailTemplates = {
    'Job Application': {
      subject: 'Application for {position}',
      message: 'Dear {hiring_manager},\n\nI am writing to express my interest in the {position} position at {company}. I have attached my resume for your review.\n\nBest regards,\n{your_name}'
    },
    'Meeting Request': {
      subject: 'Meeting Request: {topic}',
      message: 'Hello,\n\nI would like to schedule a meeting to discuss {topic}. Please let me know your availability.\n\nBest regards,\n{your_name}'
    },
    'Invoice': {
      subject: 'Invoice #{invoice_number} for {service}',
      message: 'Dear {client_name},\n\nPlease find attached the invoice for {service}.\n\nTotal Amount: {amount}\nDue Date: {due_date}\n\nThank you for your business.\n\nBest regards,\n{your_name}'
    },
    'Custom': {
      subject: subject,
      message: message
    }
  };

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: generateEmailUrl(),
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

  const generateEmailUrl = () => {
    if (!email) return ' ';
    
    const params = new URLSearchParams();
    params.append('to', email);
    
    if (cc) {
      params.append('cc', cc);
    }
    if (bcc) {
      params.append('bcc', bcc);
    }
    if (subject) {
      params.append('subject', subject);
    }
    if (message) {
      params.append('body', message);
    }
    if (attachments.length > 0) {
      params.append('attach', attachments.join(','));
    }

    return `mailto:${email}?${params.toString()}`;
  };

  // Update QR code on any changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: generateEmailUrl(),
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {},
      });
    }
  }, [email, cc, bcc, subject, message, attachments, templateName, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'email_qrcode',
        extension: 'png',
      });
    }
  };

  const handleTemplateChange = (template) => {
    setTemplateName(template);
    if (template !== 'Custom') {
      setSubject(emailTemplates[template].subject);
      setMessage(emailTemplates[template].message);
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files.map(file => file.name)]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced Email QR Generator</h2>

        <div className="mb-6">
          <label htmlFor="email-input" className="block text-lg font-medium mb-2">To:</label>
          <input
            type="email"
            id="email-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="e.g., recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="cc-input" className="block text-lg font-medium mb-2">CC:</label>
            <input
              type="email"
              id="cc-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="cc@example.com"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bcc-input" className="block text-lg font-medium mb-2">BCC:</label>
            <input
              type="email"
              id="bcc-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="bcc@example.com"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="template-select" className="block text-lg font-medium mb-2">Email Template:</label>
          <select
            id="template-select"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={templateName}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">Select a template</option>
            <option value="Job Application">Job Application</option>
            <option value="Meeting Request">Meeting Request</option>
            <option value="Invoice">Invoice</option>
            <option value="Custom">Custom Email</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="subject-input" className="block text-lg font-medium mb-2">Subject:</label>
          <input
            type="text"
            id="subject-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
          <label className="block text-lg font-medium mb-2">Attachments:</label>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 p-2 rounded">
                <span className="text-sm">{file}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="w-full p-2 bg-white/20 border border-blue-300 rounded text-white"
              multiple
            />
          </div>
        </div>

        {email && (
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
              Scan this QR code to compose an email with the specified details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailQrGenerator; 