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

const YoutubeQrGenerator = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quality, setQuality] = useState('auto');
  const [playlistItems, setPlaylistItems] = useState([]);
  const [dotStyle, setDotStyle] = useState('square');
  const qrCodeRef = useRef();
  const qrCode = useRef(null);

  const validateYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const formatTimeToSeconds = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return '';
  };

  const generateYoutubeUrl = () => {
    if (!videoUrl) return ' ';
    
    let url = videoUrl;
    const params = new URLSearchParams();
    
    if (startTime) {
      params.append('t', formatTimeToSeconds(startTime));
    }
    if (endTime) {
      params.append('end', formatTimeToSeconds(endTime));
    }
    if (quality !== 'auto') {
      params.append('vq', quality);
    }
    if (playlistItems.length > 0) {
      params.append('playlist', playlistItems.join(','));
    }

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  // Initialize QRCodeStyling instance
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 256,
      height: 256,
      type: 'canvas',
      data: generateYoutubeUrl(),
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

  // Update QR code on any changes
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: generateYoutubeUrl(),
        dotsOptions: {
          type: dotStyle,
        },
        backgroundOptions: {},
      });
    }
  }, [videoUrl, startTime, endTime, quality, playlistItems, dotStyle]);

  // Append QR code to the DOM element
  useEffect(() => {
    if (qrCode.current && qrCodeRef.current) {
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrCodeRef.current]);

  const downloadQrCode = () => {
    if (qrCode.current) {
      qrCode.current.download({
        name: 'youtube_qrcode',
        extension: 'png',
      });
    }
  };

  const addPlaylistItem = () => {
    const newItem = prompt('Enter video ID or URL:');
    if (newItem) {
      const videoId = newItem.includes('youtube.com') || newItem.includes('youtu.be')
        ? newItem.split(/[=/]/).pop()
        : newItem;
      setPlaylistItems([...playlistItems, videoId]);
    }
  };

  const removePlaylistItem = (index) => {
    setPlaylistItems(playlistItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced YouTube QR Generator</h2>

        <div className="mb-6">
          <label htmlFor="video-url-input" className="block text-lg font-medium mb-2">YouTube Video URL:</label>
          <input
            type="url"
            id="video-url-input"
            className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            placeholder="e.g., https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          {videoUrl && !validateYoutubeUrl(videoUrl) && (
            <p className="mt-1 text-sm text-red-400">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="start-time-input" className="block text-lg font-medium mb-2">Start Time (mm:ss):</label>
            <input
              type="text"
              id="start-time-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="e.g., 1:30"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-time-input" className="block text-lg font-medium mb-2">End Time (mm:ss):</label>
            <input
              type="text"
              id="end-time-input"
              className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
              placeholder="e.g., 2:45"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="quality-select" className="block text-lg font-medium mb-2">Video Quality:</label>
          <Select
            options={[
              { value: '1080p', label: '1080p (Full HD)' },
              { value: '720p', label: '720p (HD)' },
              { value: '480p', label: '480p (SD)' },
              { value: '360p', label: '360p' },
              { value: '240p', label: '240p' },
              { value: '144p', label: '144p' },
            ]}
            value={{ value: quality, label: quality }}
            onChange={(selectedOption) => setQuality(selectedOption.value)}
            styles={customSelectStyles}
            placeholder="Select video quality"
            isSearchable={false}
            isClearable={false}
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Playlist Items:</label>
          <div className="space-y-2">
            {playlistItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 p-2 rounded">
                <span className="text-sm">{item}</span>
                <button
                  onClick={() => removePlaylistItem(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addPlaylistItem}
              className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Add Video to Playlist
            </button>
          </div>
        </div>

        {videoUrl && validateYoutubeUrl(videoUrl) && (
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
              Scan this QR code to open the YouTube video with your specified settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeQrGenerator; 