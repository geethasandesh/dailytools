import React, { useState } from 'react';

const VideoToMp3 = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Video to MP3 Converter</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Selected File</h2>
            <p className="text-gray-600">{selectedFile.name}</p>
          </div>
        )}

        <button
          disabled={!selectedFile}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${!selectedFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Convert to MP3
        </button>
      </div>
    </div>
  );
};

export default VideoToMp3; 