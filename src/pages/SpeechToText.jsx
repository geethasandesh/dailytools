import React, { useState } from 'react';

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Speech to Text Converter</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-6 py-3 rounded-full text-white font-medium flex items-center space-x-2
                ${isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              <span className="w-3 h-3 rounded-full bg-white"></span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transcript
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your speech will appear here..."
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setTranscript('')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Note: Make sure your microphone is properly connected and you have granted permission to use it.</p>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText; 