import React, { useState } from 'react';

const YtToMp3 = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Function to handle conversion (placeholder for now)
  const handleConvert = async () => {
    setIsLoading(true);
    setDownloadUrl(null);
    try {
      // This is where you would typically make an API call to a backend server
      // For example:
      // const response = await fetch(`/api/convert-youtube?url=${encodeURIComponent(url)}`);
      // const blob = await response.blob();
      // const url = URL.createObjectURL(blob);
      // setDownloadUrl(url);

      // Placeholder for client-side logic (will not work for YouTube due to CORS)
      console.log('Attempting to convert YouTube URL:', url);
      // Simulate conversion success/failure after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      // setDownloadUrl('some-dummy-mp3-url.mp3'); // For testing UI

      alert('YouTube to MP3 conversion requires a backend server due to CORS and security policies. Please consider implementing a server-side solution.');

    } catch (error) {
      console.error('Error during YouTube to MP3 conversion:', error);
      alert('Failed to convert. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-white mb-8">
          YouTube to MP3 Converter
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="space-y-6">
            {/* YouTube URL Input */}
            <div>
              <label htmlFor="youtube-url" className="block text-lg font-medium text-white mb-2">
                YouTube URL
              </label>
              <input
                id="youtube-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-3 border border-blue-400 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={!url || isLoading}
              className={`w-full px-6 py-3 rounded-xl text-white font-medium transition-colors
                ${!url || isLoading
                  ? 'bg-gray-500/50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isLoading ? 'Converting...' : 'Convert to MP3'}
            </button>

            {/* Download Link */}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="converted-audio.mp3"
                className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors mt-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download MP3
              </a>
            )}

            <div className="text-center text-sm text-gray-400 mt-6">
              <p>Note: YouTube to MP3 conversion typically requires a backend server due to CORS and security policies. Client-side conversion is often limited.</p>
              <p>Please ensure you have the right to download the content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YtToMp3; 