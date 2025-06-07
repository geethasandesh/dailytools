import React, { useState } from 'react';

const ImageBackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    // TODO: Implement background removal logic
    // This will require a backend service or API integration
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Image Background Remover</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {selectedImage && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Preview</h2>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        <button
          onClick={removeBackground}
          disabled={!selectedImage || isProcessing}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${!selectedImage || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isProcessing ? 'Processing...' : 'Remove Background'}
        </button>

        {processedImage && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Result</h2>
            <img
              src={processedImage}
              alt="Processed"
              className="max-w-full h-auto rounded-lg"
            />
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = processedImage;
                link.download = 'processed-image.png';
                link.click();
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBackgroundRemover; 