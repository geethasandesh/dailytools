import React, { useState, useRef, useEffect } from 'react';
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
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setProcessedImage(null);
        setError(null);
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const loadMODNetModel = async () => {
    try {
      // For now, we'll use a placeholder for the model loading
      // In a real implementation, you would load the actual MODNet model
      console.log('Loading MODNet model...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate model loading
      return true;
    } catch (error) {
      console.error('Error loading MODNet model:', error);
      return false;
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
        return;
      }

    setIsProcessing(true);
    setError(null);

    try {
      // Create FormData for file upload
    const formData = new FormData();
      formData.append('file', selectedFile);

      // Send to backend API
      const response = await fetch('http://localhost:8000/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

      // Get the processed image blob
    const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setIsProcessing(false);

    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error processing image. Please make sure the backend server is running.');
      setIsProcessing(false);
    }
  };

  const simulateMODNetProcessing = async (imageData) => {
    // This is a placeholder for actual MODNet processing
    // In a real implementation, you would use the actual MODNet model
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const { data, width, height } = imageData;
        const newData = new Uint8ClampedArray(data);
        
        // Simple edge detection simulation (not actual MODNet)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Simple brightness-based alpha calculation
          const brightness = (r + g + b) / 3;
          const alpha = brightness > 200 ? 0 : 255; // Simple threshold
          
          newData[i] = r;
          newData[i + 1] = g;
          newData[i + 2] = b;
          newData[i + 3] = alpha;
        }
        
        const processedImageData = new ImageData(newData, width, height);
        resolve(processedImageData);
      }, 2000); // Simulate processing time
    });
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `background_removed.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetImage = () => {
    setSelectedFile(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-radial-gradient py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4">Image Background Remover</h1>
          <p className="text-xl text-gray-300">Remove backgrounds from images using advanced AI models</p>
        </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          {/* Settings Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium text-white mb-3">Model Type</label>
              <Select
                options={modelOptions}
                value={{ value: modelType, label: modelOptions.find(opt => opt.value === modelType)?.label }}
                onChange={(selectedOption) => setModelType(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select model"
                isSearchable={false}
                isClearable={false}
              />
            </div>
            
            <div>
              <label className="block text-lg font-medium text-white mb-3">Output Format</label>
              <Select
                options={formatOptions}
                value={{ value: outputFormat, label: formatOptions.find(opt => opt.value === outputFormat)?.label }}
                onChange={(selectedOption) => setOutputFormat(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select format"
                isSearchable={false}
                isClearable={false}
              />
            </div>
            
            <div>
              <label className="block text-lg font-medium text-white mb-3">Quality</label>
              <Select
                options={qualityOptions}
                value={{ value: quality, label: qualityOptions.find(opt => opt.value === quality)?.label }}
                onChange={(selectedOption) => setQuality(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select quality"
                isSearchable={false}
                isClearable={false}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-white mb-3">Upload Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-white/5 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Selected File</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{selectedFile.name}</span>
                <span className="text-sm text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
              {error}
                </div>
              )}

          {/* Processing Status */}
              {isProcessing && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-xl text-blue-300">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300 mr-3"></div>
                Processing image with MODNet model...
              </div>
                </div>
              )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={processImage}
              disabled={!selectedFile || isProcessing}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg ${
                !selectedFile || isProcessing
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </button>
            
            {processedImage && (
              <button
                onClick={downloadImage}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:scale-105"
              >
                Download Result
              </button>
            )}
            
            <button
              onClick={resetImage}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:scale-105"
            >
              Reset
            </button>
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {selectedFile && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Original Image</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Original"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                </div>
              )}

              {processedImage && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Processed Image</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div> xx
    </div>
  );
};

export default ImageBackgroundRemover; 