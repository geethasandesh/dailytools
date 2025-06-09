import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const DocumentConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionType, setConversionType] = useState('pdf-to-word');
  const [conversionOptions, setConversionOptions] = useState({
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
    }
  });
  const [conversionProgress, setConversionProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = {
    'pdf-to-word': {
      input: '.pdf',
      output: '.docx',
      label: 'PDF to Word',
      description: 'Convert PDF to editable Word document'
    },
    'word-to-pdf': {
      input: '.docx,.doc',
      output: '.pdf',
      label: 'Word to PDF',
      description: 'Convert Word document to PDF'
    },
    'pdf-to-text': {
      input: '.pdf',
      output: '.txt',
      label: 'PDF to Text',
      description: 'Extract text from PDF'
    },
    'pdf-to-image': {
      input: '.pdf',
      output: '.png,.jpg',
      label: 'PDF to Image',
      description: 'Convert PDF pages to images'
    },
    'image-to-pdf': {
      input: '.png,.jpg,.jpeg',
      output: '.pdf',
      label: 'Image to PDF',
      description: 'Convert images to PDF'
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview for PDFs and images
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleOptionChange = (option, value) => {
    setConversionOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleMetadataChange = (field, value) => {
    setConversionOptions(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const simulateConversion = async () => {
    setConversionProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setConversionProgress(i);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      await simulateConversion();

      // Here you would implement the actual conversion logic
      // For now, we'll just create a dummy file
      const outputFormat = supportedFormats[conversionType].output.split(',')[0];
      const outputFileName = selectedFile.name.split('.')[0] + outputFormat;
      
      // Create a dummy file for demonstration
      const dummyContent = new Blob(['Converted file content'], { type: 'application/octet-stream' });
      saveAs(dummyContent, outputFileName);
    } catch (err) {
      setError('Conversion failed. Please try again.');
      console.error('Conversion error:', err);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">Advanced Document Converter</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Conversion Type</label>
              <select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                {Object.entries(supportedFormats).map(([key, format]) => (
                  <option key={key} value={key}>
                    {format.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-300">
                {supportedFormats[conversionType].description}
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Upload File</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">
                      Supported formats: {supportedFormats[conversionType].input}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={supportedFormats[conversionType].input}
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
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Conversion Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preserveFormatting"
                    checked={conversionOptions.preserveFormatting}
                    onChange={(e) => handleOptionChange('preserveFormatting', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="preserveFormatting" className="ml-2 text-sm text-gray-300">
                    Preserve formatting
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="extractImages"
                    checked={conversionOptions.extractImages}
                    onChange={(e) => handleOptionChange('extractImages', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="extractImages" className="ml-2 text-sm text-gray-300">
                    Extract images
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="extractTables"
                    checked={conversionOptions.extractTables}
                    onChange={(e) => handleOptionChange('extractTables', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="extractTables" className="ml-2 text-sm text-gray-300">
                    Extract tables
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ocrEnabled"
                    checked={conversionOptions.ocrEnabled}
                    onChange={(e) => handleOptionChange('ocrEnabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="ocrEnabled" className="ml-2 text-sm text-gray-300">
                    Enable OCR
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Page Range</label>
                  <input
                    type="text"
                    value={conversionOptions.pageRange}
                    onChange={(e) => handleOptionChange('pageRange', e.target.value)}
                    placeholder="e.g., 1-5, 8, 11-13"
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password (if protected)</label>
                  <input
                    type="password"
                    value={conversionOptions.password}
                    onChange={(e) => handleOptionChange('password', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={conversionOptions.watermark}
                    onChange={(e) => handleOptionChange('watermark', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Document Metadata</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={conversionOptions.metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    value={conversionOptions.metadata.author}
                    onChange={(e) => handleMetadataChange('author', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={conversionOptions.metadata.subject}
                    onChange={(e) => handleMetadataChange('subject', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Keywords</label>
                  <input
                    type="text"
                    value={conversionOptions.metadata.keywords}
                    onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {conversionProgress > 0 && conversionProgress < 100 && (
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${conversionProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-300">
              Converting... {conversionProgress}%
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleConvert}
            disabled={!selectedFile}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-lg
              ${!selectedFile
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Convert Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentConverter; 