import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const PdfTools = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toolType, setToolType] = useState('convert');
  const [options, setOptions] = useState({
    // Conversion options
    preserveFormatting: true,
    extractImages: true,
    extractTables: true,
    maintainLayout: true,
    password: '',
    pageRange: '',
    quality: 'high',
    language: 'auto',
    ocrEnabled: false,
    watermark: '',
    metadata: {
      title: '',
      author: '',
      subject: '',
      keywords: ''
    },
    // Compression options
    compressionLevel: 'medium',
    imageQuality: 80,
    removeMetadata: false,
    // Split options
    splitPages: '',
    splitBySize: false,
    maxSizeMB: 5,
    // Merge options
    mergeOrder: [],
    // Signing options
    signatureType: 'text',
    signatureText: '',
    signatureImage: null,
    signaturePosition: { x: 100, y: 100 },
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
    convert: {
      label: 'Convert PDF',
      description: 'Convert PDF to other formats',
      icon: '🔄',
      input: '.pdf',
      output: '.docx,.pptx,.xlsx,.txt',
      options: ['preserveFormatting', 'extractImages', 'extractTables', 'ocrEnabled', 'pageRange', 'password', 'watermark', 'metadata'],
      formats: [
        { value: 'pdf-to-word', label: 'PDF to Word', output: '.docx', description: 'Convert PDF to editable Word document' },
        { value: 'pdf-to-pptx', label: 'PDF to PowerPoint', output: '.pptx', description: 'Convert PDF to PowerPoint presentation' },
        { value: 'pdf-to-excel', label: 'PDF to Excel', output: '.xlsx', description: 'Convert PDF tables to Excel spreadsheet' },
        { value: 'pdf-to-text', label: 'PDF to Text', output: '.txt', description: 'Extract text from PDF' },
        { value: 'pdf-to-image', label: 'PDF to Image', output: '.png,.jpg', description: 'Convert PDF pages to images' }
      ]
    },
    compress: {
      label: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: '📦',
      input: '.pdf',
      output: '.pdf',
      options: ['compressionLevel', 'imageQuality', 'removeMetadata']
    },
    merge: {
      label: 'Merge PDFs',
      description: 'Combine multiple PDF files into one',
      icon: '🔄',
      input: '.pdf',
      output: '.pdf',
      options: ['mergeOrder']
    },
    split: {
      label: 'Split PDF',
      description: 'Split PDF into multiple files',
      icon: '✂️',
      input: '.pdf',
      output: '.pdf',
      options: ['splitPages', 'splitBySize', 'maxSizeMB']
    },
    sign: {
      label: 'Sign PDF',
      description: 'Add digital signature to PDF',
      icon: '✍️',
      input: '.pdf',
      output: '.pdf',
      options: ['signatureType', 'signatureText', 'signatureImage', 'signaturePosition']
    },
    unlock: {
      label: 'Unlock PDF',
      description: 'Remove password protection',
      icon: '🔓',
      input: '.pdf',
      output: '.pdf',
      options: ['password']
    },
    number: {
      label: 'Add Page Numbers',
      description: 'Add page numbers to PDF',
      icon: '🔢',
      input: '.pdf',
      output: '.pdf',
      options: ['startNumber', 'position', 'format']
    },
    compare: {
      label: 'Compare PDFs',
      description: 'Compare two PDF files and highlight differences',
      icon: '🔍',
      input: '.pdf',
      output: '.pdf',
      options: ['highlightChanges', 'showOnlyDifferences']
    }
  };

  const [selectedFormat, setSelectedFormat] = useState('pdf-to-word');

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (tools[toolType].label === 'Merge PDFs' || tools[toolType].label === 'Compare PDFs') {
      setSelectedFiles(files);
      setSelectedFile(null);
    } else {
      setSelectedFile(files[0]);
      setSelectedFiles([]);
    }
    setError(null);
  };

  const handleOptionChange = (option, value) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleMetadataChange = (field, value) => {
    setOptions(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
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
    if (!selectedFile && selectedFiles.length === 0) return;

    try {
      setError(null);
      await simulateProgress();

      // Here you would implement the actual PDF processing logic
      // For now, we'll just create a dummy file
      const outputFileName = `processed_${selectedFile ? selectedFile.name : selectedFiles[0].name}`;
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
                  onClick={() => {
                    setToolType(key);
                    if (key === 'convert') {
                      setSelectedFormat('pdf-to-word');
                    }
                  }}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    toolType === key
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
            {toolType === 'convert' && (
        <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select Conversion Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {tools.convert.formats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-300">
                  {tools.convert.formats.find(f => f.value === selectedFormat)?.description}
                </p>
              </div>
            )}

            <div>
              <label className="block text-lg font-medium mb-2">Upload {tools[toolType].label === 'Merge PDFs' || tools[toolType].label === 'Compare PDFs' ? 'Files' : 'File'}</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">
                      {toolType === 'convert' 
                        ? `Convert to: ${tools.convert.formats.find(f => f.value === selectedFormat)?.output}`
                        : `Supported formats: ${tools[toolType].input}`
                      }
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={tools[toolType].input}
                    multiple={tools[toolType].label === 'Merge PDFs' || tools[toolType].label === 'Compare PDFs'}
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {selectedFile && (
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Selected File</h3>
                <p className="text-gray-300">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

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
              {tools[toolType].options.map(option => {
                switch (option) {
                  case 'preserveFormatting':
                  case 'extractImages':
                  case 'extractTables':
                  case 'ocrEnabled':
                  case 'removeMetadata':
                  case 'splitBySize':
                  case 'highlightChanges':
                  case 'showOnlyDifferences':
                    return (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option}
                          checked={options[option]}
                          onChange={(e) => handleOptionChange(option, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={option} className="ml-2 text-sm text-gray-300">
                          {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                    );

                  case 'compressionLevel':
                    return (
                      <div key={option}>
                        <label className="block text-sm font-medium mb-1">Compression Level</label>
                        <select
                          value={options[option]}
                          onChange={(e) => handleOptionChange(option, e.target.value)}
                          className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          <option value="low">Low (Better Quality)</option>
                          <option value="medium">Medium (Balanced)</option>
                          <option value="high">High (Smaller Size)</option>
                        </select>
                      </div>
                    );

                  case 'imageQuality':
                    return (
                      <div key={option}>
                        <label className="block text-sm font-medium mb-1">Image Quality: {options[option]}%</label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={options[option]}
                          onChange={(e) => handleOptionChange(option, Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    );

                  case 'pageRange':
                  case 'splitPages':
                  case 'password':
                  case 'watermark':
                  case 'signatureText':
                  case 'format':
                    return (
                      <div key={option}>
                        <label className="block text-sm font-medium mb-1">
                          {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <input
                          type={option === 'password' ? 'password' : 'text'}
                          value={options[option]}
                          onChange={(e) => handleOptionChange(option, e.target.value)}
                          placeholder={option === 'pageRange' || option === 'splitPages' ? 'e.g., 1-5, 8, 11-13' : ''}
                          className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                      </div>
                    );

                  case 'maxSizeMB':
                    return (
                      <div key={option}>
                        <label className="block text-sm font-medium mb-1">Max Size (MB)</label>
                        <input
                          type="number"
                          value={options[option]}
                          onChange={(e) => handleOptionChange(option, Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                      </div>
                    );

                  case 'metadata':
                    return (
                      <div key={option} className="space-y-4">
                        <h4 className="text-sm font-medium">Document Metadata</h4>
                        {Object.keys(options.metadata).map(field => (
                          <div key={field}>
                            <label className="block text-sm font-medium mb-1">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
                              type="text"
                              value={options.metadata[field]}
                              onChange={(e) => handleMetadataChange(field, e.target.value)}
                              className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                          </div>
                        ))}
                      </div>
                    );

                  default:
                    return null;
                }
              })}
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
            disabled={!selectedFile && selectedFiles.length === 0}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-lg
              ${!selectedFile && selectedFiles.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
            Process {tools[toolType].label}
        </button>
        </div>
      </div>
    </div>
  );
};

export default PdfTools; 