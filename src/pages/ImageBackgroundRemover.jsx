import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';

const ImageBackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [useBackend, setUseBackend] = useState(true);
  const [selectedModel, setSelectedModel] = useState('u2net');
  const [advancedSettings, setAdvancedSettings] = useState({
    postProcess: true,
    alphaMatting: false,
    alphaMattingForegroundThreshold: 240,
    alphaMattingBackgroundThreshold: 10,
    alphaMattingErodeSize: 10
  });
  const [availableModels, setAvailableModels] = useState({});
  const [processingMethod, setProcessingMethod] = useState('backend'); // 'backend' or 'client'
  const timerRef = useRef();

  // Available models for client-side processing (@imgly/background-removal)
  const clientModels = {
    'isnet': 'General Purpose',
    'isnet_fp16': 'Fast Processing',
    'isnet_quint8': 'Optimized Processing'
  };

  // Model mapping for backend (rembg) to client-side conversion
  const modelMapping = {
    'u2net': 'isnet',
    'u2net_human_seg': 'isnet',
    'u2net_cloth_seg': 'isnet',
    'silueta': 'isnet_fp16',
    'isnet-general-use': 'isnet',
    'isnet-anime': 'isnet'
  };

  useEffect(() => {
    // Fetch available models from backend
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/models');
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models || clientModels);
      }
    } catch (error) {
      console.log('Backend not available, using client-side processing');
      setAvailableModels(clientModels);
      setUseBackend(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setProcessedImage(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processWithBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', selectedModel);
    formData.append('post_process', advancedSettings.postProcess);
    formData.append('alpha_matting', advancedSettings.alphaMatting);
    formData.append('alpha_matting_foreground_threshold', advancedSettings.alphaMattingForegroundThreshold);
    formData.append('alpha_matting_background_threshold', advancedSettings.alphaMattingBackgroundThreshold);
    formData.append('alpha_matting_erode_size', advancedSettings.alphaMattingErodeSize);

    const response = await fetch('http://127.0.0.1:8000/api/v1/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Backend processing failed');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const processWithClient = async (imageElement) => {
    const result = await removeBackground(imageElement, {
      model: selectedModel,
      output: {
        format: 'image/png',
        quality: 0.8
      }
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(result, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError('');
    setProcessedImage(null);
    setElapsed(0);
    
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    try {
      let result;
      
      if (processingMethod === 'backend' && useBackend) {
        // Convert data URL to file for backend
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        result = await processWithBackend(file);
      } else {
        // Client-side processing
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        result = await processWithClient(img);
      }
      
      setProcessedImage(result);
    } catch (e) {
      console.error('Processing error:', e);
      setError(`Failed to remove background: ${e.message}. Try a different image or processing method.`);
    }
    
    clearInterval(timerRef.current);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      link.click();
    }
  };

  const handleAdvancedSettingsChange = (setting, value) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  React.useEffect(() => {
    if (!isProcessing) {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
  }, [isProcessing]);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">Image Background Remover</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Processing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/5 border border-blue-400/50 rounded-xl"
                />
              </div>

              {selectedImage && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-white mb-2">Preview</h2>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full h-auto rounded-xl border border-blue-400/50 bg-white/10"
                    style={{ maxHeight: 320 }}
                  />
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center mb-4">
                  <svg className="animate-spin h-10 w-10 text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span className="text-blue-200 font-medium">Processing... {elapsed}s</span>
                </div>
              )}

              <button
                onClick={handleRemoveBackground}
                disabled={!selectedImage || isProcessing}
                className={`w-full mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 ${!selectedImage || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Processing...' : 'Remove Background'}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-900/60 text-red-200 rounded-xl border border-red-400">
                  {error}
                </div>
              )}

              {processedImage && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-white mb-2">Result</h2>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-w-full h-auto rounded-xl border border-green-400/50 bg-white/10"
                    style={{ maxHeight: 320 }}
                  />
                  <button
                    onClick={handleDownload}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-blue-400">
              <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
              
              {/* Processing Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Processing Method</label>
                <select
                  value={processingMethod}
                  onChange={(e) => setProcessingMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-blue-400/50 rounded-lg text-white"
                >
                  <option value="backend">Backend (Recommended)</option>
                  <option value="client">Client-side</option>
                </select>
              </div>

              {/* Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-blue-400/50 rounded-lg text-white"
                >
                  {Object.entries(availableModels).map(([key, description]) => (
                    <option key={key} value={key}>{description}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Settings */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white mb-3">Advanced Settings</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={advancedSettings.postProcess}
                      onChange={(e) => handleAdvancedSettingsChange('postProcess', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-white">Post-process mask</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={advancedSettings.alphaMatting}
                      onChange={(e) => handleAdvancedSettingsChange('alphaMatting', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-white">Alpha matting</span>
                  </label>
                </div>
              </div>

              {/* Model Recommendations */}
              <div className="bg-blue-900/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-200 mb-2">Model Recommendations</h4>
                <ul className="text-xs text-blue-100 space-y-1">
                  <li>• <strong>u2net:</strong> General purpose, best overall</li>
                  <li>• <strong>u2net_human_seg:</strong> Human portraits</li>
                  <li>• <strong>u2net_cloth_seg:</strong> Clothing items</li>
                  <li>• <strong>isnet-anime:</strong> Anime/cartoon images</li>
                  <li>• <strong>silueta:</strong> Fast processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBackgroundRemover; 