import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const VideoToMp3 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const ffmpegRef = useRef(null);
  const loaded = useRef(false);

  const loadFFmpeg = async () => {
    if (loaded.current) {
      console.log('FFmpeg already loaded.');
      return;
    }
    console.log('Attempting to load FFmpeg...');
    try {
      const ffmpeg = ffmpegRef.current = new FFmpeg();
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg log]', message);
      });
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
        console.log('[FFmpeg progress]', Math.round(progress * 100) + '%');
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      console.log('Loading FFmpeg core from:', baseURL);
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      loaded.current = true;
      console.log('FFmpeg loaded successfully.');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      alert('Failed to load FFmpeg. Please check console for details.');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDownloadUrl(null); // Reset download URL when new file is selected
      console.log('File selected:', file.name, '(', (file.size / (1024 * 1024)).toFixed(2), 'MB)');
    }
  };

  const convertToMp3 = async () => {
    if (!selectedFile) {
      alert('Please select a video file first.');
      return;
    }

    try {
      setIsConverting(true);
      setProgress(0);
      console.log('Starting conversion...');

      await loadFFmpeg(); // Ensure FFmpeg is loaded
      
      if (!ffmpegRef.current) {
        console.error('FFmpeg instance is null after loading attempt.');
        alert('FFmpeg is not ready. Please try again.');
        return;
      }

      console.log('Writing file to FFmpeg virtual file system...');
      await ffmpegRef.current.writeFile('input.mp4', await fetchFile(selectedFile));
      console.log('File written. Executing FFmpeg command...');
      
      await ffmpegRef.current.exec([
        '-i', 'input.mp4',
        '-vn',
        '-acodec', 'libmp3lame',
        '-q:a', '2',
        'output.mp3'
      ]);
      console.log('FFmpeg command executed. Reading output...');
      
      const data = await ffmpegRef.current.readFile('output.mp3');
      console.log('Output read. Creating download URL...');
      
      const url = URL.createObjectURL(new Blob([data], { type: 'audio/mp3' }));
      setDownloadUrl(url);
      console.log('Download URL created:', url);
      
      console.log('Cleaning up FFmpeg virtual file system...');
      await ffmpegRef.current.deleteFile('input.mp4');
      await ffmpegRef.current.deleteFile('output.mp3');
      console.log('Cleanup complete. Conversion successful!');
    } catch (error) {
      console.error('Error during conversion process:', error);
      alert('Error converting video. Please check console for details.');
    } finally {
      setIsConverting(false);
      console.log('Conversion process finished.');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-white mb-8">
          Video to MP3 Converter
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="flex flex-col items-center justify-center w-full">
              <label 
                htmlFor="video-upload" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-400 border-dashed rounded-3xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-white">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">MP4, MOV, AVI (MAX. 100MB)</p>
                </div>
                <input 
                  id="video-upload" 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-white/5 rounded-2xl p-4 border border-blue-400/50">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isConverting && (
              <div className="space-y-2">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-white text-sm">Converting... {progress}%</p>
              </div>
            )}

            {/* Download Button */}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`${selectedFile.name.split('.')[0]}.mp3`}
                className="flex items-center justify-center w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download MP3
              </a>
            )}

            {/* Convert Button */}
            <button
              onClick={convertToMp3}
              disabled={!selectedFile || isConverting}
              className={`w-full px-6 py-3 rounded-xl text-white font-medium transition-colors
                ${!selectedFile || isConverting
                  ? 'bg-gray-500/50 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isConverting ? 'Converting...' : 'Convert to MP3'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoToMp3;