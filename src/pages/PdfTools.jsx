import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const PdfTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTool, setSelectedTool] = useState('compress');
  const [options, setOptions] = useState({
    // Compression options
    compressionLevel: 'medium',
    imageQuality: 80,
    removeMetadata: false,
    
    // Merge options
    mergeOrder: [],
    
    // Split options
    splitPages: '',
    splitBySize: false,
    maxSizeMB: 5,
    
    // Conversion options
    outputFormat: 'pptx',
    preserveFormatting: true,
    
    // Signing options
    signatureType: 'text',
    signatureText: '',
    signatureImage: null,
    signaturePosition: { x: 100, y: 100 },
    
    // Unlock options
    password: '',
    
    // Page numbering options
    startNumber: 1,
    position: 'bottom-right',
    format: '{page} of {total}',
    
    // Compare options
    highlightChanges: true,
    showOnlyDifferences: false
  });
  
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const tools = {
    compress: {
      label: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: '📦',
      options: ['compressionLevel', 'imageQuality', 'removeMetadata']
    },
    merge: {
      label: 'Merge PDFs',
      description: 'Combine multiple PDF files into one',
      icon: '🔄',
      options: ['mergeOrder']
    },
    split: {
      label: 'Split PDF',
      description: 'Split PDF into multiple files',
      icon: '✂️',
      options: ['splitPages', 'splitBySize', 'maxSizeMB']
    },
    convert: {
      label: 'Convert PDF',
      description: 'Convert PDF to other formats',
      icon: '🔄',
      options: ['outputFormat', 'preserveFormatting']
    },
    sign: {
      label: 'Sign PDF',
      description: 'Add digital signature to PDF',
      icon: '✍️',
      options: ['signatureType', 'signatureText', 'signatureImage', 'signaturePosition']
    },
    unlock: {
      label: 'Unlock PDF',
      description: 'Remove password protection',
      icon: '🔓',
      options: ['password']
    },
    number: {
      label: 'Add Page Numbers',
      description: 'Add page numbers to PDF',
      icon: '🔢',
      options: ['startNumber', 'position', 'format']
    },
    compare: {
      label: 'Compare PDFs',
      description: 'Compare two PDF files and highlight differences',
      icon: '🔍',
      options: ['highlightChanges', 'showOnlyDifferences']
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setError(null);
  };

  const handleOptionChange = (option, value) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const simulateProgress = async () => {
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setError(null);
      await simulateProgress();

      // Here you would implement the actual PDF processing logic
      // For now, we'll just create a dummy file
      const outputFileName = `processed_${selectedFiles[0].name}`;
      const dummyContent = new Blob(['Processed file content'], { type: 'application/pdf' });
      saveAs(dummyContent, outputFileName);
    } catch (err) {
      setError('Processing failed. Please try again.');
      console.error('Processing error:', err);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced PDF Toolkit</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tools Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Select Tool</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {Object.entries(tools).map(([key, tool]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedTool === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h4 className="font-medium">{tool.label}</h4>
                      <p className="text-sm text-gray-300">{tool.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Upload Files</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF files only</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    multiple
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Selected Files</h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{file.name}</span>
                      <span className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Options Panel */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Options</h3>
            <div className="space-y-4">
              {selectedTool === 'compress' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Compression Level</label>
                    <select
                      value={options.compressionLevel}
                      onChange={(e) => handleOptionChange('compressionLevel', e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="low">Low (Better Quality)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Smaller Size)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image Quality: {options.imageQuality}%</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={options.imageQuality}
                      onChange={(e) => handleOptionChange('imageQuality', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeMetadata"
                      checked={options.removeMetadata}
                      onChange={(e) => handleOptionChange('removeMetadata', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="removeMetadata" className="ml-2 text-sm text-gray-300">
                      Remove metadata
                    </label>
                  </div>
                </>
              )}

              {selectedTool === 'merge' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Merge Order</label>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={options.mergeOrder[index] || index + 1}
                          onChange={(e) => {
                            const newOrder = [...options.mergeOrder];
                            newOrder[index] = Number(e.target.value);
                            handleOptionChange('mergeOrder', newOrder);
                          }}
                          className="w-20 p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                        <span className="text-gray-300">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTool === 'split' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Split Pages</label>
                    <input
                      type="text"
                      value={options.splitPages}
                      onChange={(e) => handleOptionChange('splitPages', e.target.value)}
                      placeholder="e.g., 1-5, 8, 11-13"
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="splitBySize"
                      checked={options.splitBySize}
                      onChange={(e) => handleOptionChange('splitBySize', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="splitBySize" className="ml-2 text-sm text-gray-300">
                      Split by size
                    </label>
                  </div>
                  {options.splitBySize && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Size (MB)</label>
                      <input
                        type="number"
                        value={options.maxSizeMB}
                        onChange={(e) => handleOptionChange('maxSizeMB', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  )}
                </>
              )}

              {selectedTool === 'convert' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Output Format</label>
                    <select
                      value={options.outputFormat}
                      onChange={(e) => handleOptionChange('outputFormat', e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="pptx">PowerPoint</option>
                      <option value="docx">Word</option>
                      <option value="xlsx">Excel</option>
                      <option value="jpg">Images</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preserveFormatting"
                      checked={options.preserveFormatting}
                      onChange={(e) => handleOptionChange('preserveFormatting', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="preserveFormatting" className="ml-2 text-sm text-gray-300">
                      Preserve formatting
                    </label>
                  </div>
                </>
              )}

              {selectedTool === 'sign' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Signature Type</label>
                    <select
                      value={options.signatureType}
                      onChange={(e) => handleOptionChange('signatureType', e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="draw">Draw</option>
                    </select>
                  </div>
                  {options.signatureType === 'text' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Signature Text</label>
                      <input
                        type="text"
                        value={options.signatureText}
                        onChange={(e) => handleOptionChange('signatureText', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  )}
                  {options.signatureType === 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Signature Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleOptionChange('signatureImage', e.target.files[0])}
                        className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  )}
                </>
              )}

              {selectedTool === 'unlock' && (
                <div>
                  <label className="block text-sm font-medium mb-1">PDF Password</label>
                  <input
                    type="password"
                    value={options.password}
                    onChange={(e) => handleOptionChange('password', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              )}

              {selectedTool === 'number' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Number</label>
                    <input
                      type="number"
                      value={options.startNumber}
                      onChange={(e) => handleOptionChange('startNumber', Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <select
                      value={options.position}
                      onChange={(e) => handleOptionChange('position', e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Format</label>
                    <input
                      type="text"
                      value={options.format}
                      onChange={(e) => handleOptionChange('format', e.target.value)}
                      placeholder="{page} of {total}"
                      className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </>
              )}

              {selectedTool === 'compare' && (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="highlightChanges"
                      checked={options.highlightChanges}
                      onChange={(e) => handleOptionChange('highlightChanges', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="highlightChanges" className="ml-2 text-sm text-gray-300">
                      Highlight changes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showOnlyDifferences"
                      checked={options.showOnlyDifferences}
                      onChange={(e) => handleOptionChange('showOnlyDifferences', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="showOnlyDifferences" className="ml-2 text-sm text-gray-300">
                      Show only differences
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-300">
              Processing... {progress}%
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleProcess}
            disabled={selectedFiles.length === 0}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-lg
              ${selectedFiles.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Process Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfTools; 