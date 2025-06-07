import React, { useState } from 'react';

const ReelsDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Reels Downloader</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reels URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          disabled={!url || isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${!url || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Processing...' : 'Download Reel'}
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>Supported platforms:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Instagram Reels</li>
            <li>Facebook Reels</li>
            <li>TikTok</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReelsDownloader; 