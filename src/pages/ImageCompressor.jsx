import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('jpeg');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [preset, setPreset] = useState('custom');
  const fileInputRef = useRef(null);

  const presets = {
    'web': { quality: 80, maxWidth: 1920, maxHeight: 1080, format: 'jpeg' },
    'mobile': { quality: 85, maxWidth: 1080, maxHeight: 1920, format: 'jpeg' },
    'thumbnail': { quality: 90, maxWidth: 400, maxHeight: 400, format: 'jpeg' },
    'social': { quality: 85, maxWidth: 1200, maxHeight: 630, format: 'jpeg' },
    'print': { quality: 100, maxWidth: 3000, maxHeight: 3000, format: 'png' },
    'custom': { quality: quality, maxWidth: maxWidth, maxHeight: maxHeight, format: format }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedSize(0);
      setCompressionProgress(0);
    }
  };

  const handlePresetChange = (presetName) => {
    setPreset(presetName);
    if (presetName !== 'custom') {
      const selectedPreset = presets[presetName];
      setQuality(selectedPreset.quality);
      setMaxWidth(selectedPreset.maxWidth);
      setMaxHeight(selectedPreset.maxHeight);
      setFormat(selectedPreset.format);
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
      initialQuality: quality / 100,
      onProgress: (progress) => {
        setCompressionProgress(Math.round(progress * 100));
      }
    };

    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setCompressedFile(compressedFile);
      setCompressedSize(compressedFile.size);
      
      // Convert to selected format if needed
      if (format !== selectedFile.type.split('/')[1]) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            setCompressedFile(new File([blob], `compressed.${format}`, { type: `image/${format}` }));
          }, `image/${format}`);
        };
        
        img.src = URL.createObjectURL(compressedFile);
      }
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const downloadImage = () => {
    if (compressedFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(compressedFile);
      link.download = `compressed.${format}`;
      link.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced Image Compressor</h2>

        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Upload Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-300">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
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

        {selectedFile && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Original Image</h3>
                <img src={previewUrl} alt="Original" className="w-full h-auto rounded-lg" />
                <p className="mt-2 text-sm text-gray-300">Size: {formatFileSize(originalSize)}</p>
              </div>
              {compressedFile && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Compressed Image</h3>
                  <img src={URL.createObjectURL(compressedFile)} alt="Compressed" className="w-full h-auto rounded-lg" />
                  <p className="mt-2 text-sm text-gray-300">Size: {formatFileSize(compressedSize)}</p>
                  <p className="text-sm text-green-400">
                    Saved: {formatFileSize(originalSize - compressedSize)} ({Math.round((1 - compressedSize / originalSize) * 100)}%)
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-2">Preset</label>
                <select
                  value={preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="custom">Custom</option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="thumbnail">Thumbnail</option>
                  <option value="social">Social Media</option>
                  <option value="print">Print</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Max Width</label>
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Max Height</label>
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintainAspectRatio"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="maintainAspectRatio" className="ml-2 text-sm text-gray-300">
                  Maintain aspect ratio
                </label>
              </div>
            </div>

            {compressionProgress > 0 && compressionProgress < 100 && (
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${compressionProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={compressImage}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Compress Image
              </button>
              {compressedFile && (
                <button
                  onClick={downloadImage}
                  className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor; 