import React, { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';

const ImageBackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setProcessedImage(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
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
      const img = new window.Image();
      img.src = selectedImage;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const result = await removeBackground(img);
      const canvas = document.createElement('canvas');
      canvas.width = result.width;
      canvas.height = result.height;
      const ctx = canvas.getContext('2d');
      ctx.putImageData(result, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    } catch (e) {
      setError('Failed to remove background. Try a different image or refresh the page.');
    }
    clearInterval(timerRef.current);
    setIsProcessing(false);
  };

  React.useEffect(() => {
    if (!isProcessing) {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    // eslint-disable-next-line
  }, [isProcessing]);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">Image Background Remover</h1>
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
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = processedImage;
                  link.download = 'background-removed.png';
                  link.click();
                }}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageBackgroundRemover; 