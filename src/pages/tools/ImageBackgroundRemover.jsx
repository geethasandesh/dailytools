import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { validateFile, formatFileSize } from '../../utils/fileValidation';
import LoadingSpinner from '../../components/LoadingSpinner';

// ✅ Dynamic API base: Local when dev, Railway when deployed
const API_BASE =
  import.meta.env.MODE === 'production'
    ? 'https://dailytools-backend-production.up.railway.app'
    : 'http://127.0.0.1:8000';

// Custom styles for react-select to make it transparent
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgb(147 197 253)',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 2px rgb(59 130 246)' : 'none',
    '&:hover': {
      border: '1px solid rgb(147 197 253)',
    },
    backdropFilter: 'blur(4px)',
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

const ImageBackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [modelType, setModelType] = useState('modnet');
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState(0.9);
  const [backendStatus, setBackendStatus] = useState('checking');
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      console.log('Checking backend at:', `${API_BASE}/health`);
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('Backend response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Backend data:', data);
        setBackendStatus('online');
      } else {
        console.error('Backend error:', res.status, res.statusText);
        setBackendStatus('offline');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('offline');
    }
  };

  const modelOptions = [
    { value: 'modnet', label: 'MODNet (Recommended)' },
    { value: 'modnet_photographic', label: 'MODNet Photographic' },
    { value: 'modnet_webcam', label: 'MODNet Webcam' },
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG (Transparent)' },
    { value: 'jpg', label: 'JPG (White Background)' },
    { value: 'webp', label: 'WebP (Transparent)' },
  ];

  const qualityOptions = [
    { value: 0.7, label: 'Low (70%)' },
    { value: 0.8, label: 'Medium (80%)' },
    { value: 0.9, label: 'High (90%)' },
    { value: 1.0, label: 'Maximum (100%)' },
  ];

  const handleFileSelect = (event) => {
    setError(null);
    setProcessedImage(null);
    const file = event.target.files[0];
    
    const validation = validateFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setSelectedFile(file);
  };

  const processImage = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('model_type', modelType);
    formData.append('output_format', outputFormat);
    formData.append('quality', quality);

    try {
      console.log('Sending request to:', `${API_BASE}/remove-background`);
      const res = await fetch(`${API_BASE}/remove-background`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || 'Processing failed.');
        setIsProcessing(false);
        return;
      }
      const blob = await res.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (e) {
      setError('Failed to connect to backend.');
    }
    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `background_removed.${outputFormat}`;
    link.click();
  };

  const resetImage = () => {
    setSelectedFile(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">Image Background Remover</h1>
          <p className="text-base text-purple-200">Remove backgrounds from images using advanced AI models</p>
        </div>
        <div className="mb-6 text-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              backendStatus === 'online' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            Backend: {backendStatus}
          </span>
        </div>
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm">{error}</div>}

      {/* File Upload */}
      {!selectedFile && (
        <div className="mb-8">
          <label className="block text-lg font-medium text-white mb-3">Upload Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-16 h-16 mb-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-lg text-gray-300">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">Supports: JPG, PNG, WebP (Max 10MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      )}

      {/* Controls */}
      {selectedFile && (
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-white mb-1">Model</label>
            <Select
              value={modelOptions.find((opt) => opt.value === modelType)}
              onChange={(opt) => setModelType(opt.value)}
              options={modelOptions}
              styles={customSelectStyles}
              isDisabled={isProcessing}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white mb-1">Output Format</label>
            <Select
              value={formatOptions.find((opt) => opt.value === outputFormat)}
              onChange={(opt) => setOutputFormat(opt.value)}
              options={formatOptions}
              styles={customSelectStyles}
              isDisabled={isProcessing}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white mb-1">Quality</label>
            <Select
              value={qualityOptions.find((opt) => opt.value === quality)}
              onChange={(opt) => setQuality(opt.value)}
              options={qualityOptions}
              styles={customSelectStyles}
              isDisabled={isProcessing}
            />
          </div>
        </div>
      )}

      {/* Image Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {selectedFile && (
          <div className="relative">
            <h3 className="text-lg font-medium text-white mb-4">Original Image</h3>
            <div className="bg-white/5 rounded-xl p-4 relative overflow-hidden">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Original"
                className={`w-full h-auto rounded-lg transition-all duration-300 ${
                  isProcessing ? 'opacity-70' : ''
                }`}
                style={{ filter: isProcessing ? 'blur(2px) brightness(0.8)' : 'none' }}
              />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm z-10 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400 mb-4"></div>
                  <span className="text-blue-700 font-semibold text-lg drop-shadow">
                    Processing...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {processedImage && (
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Processed Image</h3>
            <div className="bg-white/5 rounded-xl p-4">
              <img src={processedImage} alt="Processed" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        {selectedFile && !isProcessing && (
          <>
            <button
              className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-all duration-200"
              onClick={processImage}
              disabled={isProcessing}
            >
              Remove Background
            </button>
            <button
              className="px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all duration-200"
              onClick={resetImage}
              disabled={isProcessing}
            >
              Reset
            </button>
          </>
        )}
        {processedImage && !isProcessing && (
          <button
            className="px-5 py-2.5 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-300 rounded-xl font-medium text-sm hover:bg-green-500/30 transition-all duration-200"
            onClick={downloadImage}
          >
            Download
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default ImageBackgroundRemover;
