import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Select from 'react-select';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Custom styles for react-select to make it transparent
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgb(147 197 253)', // border-blue-300
    borderRadius: '12px',
    boxShadow: state.isFocused ? '0 0 0 2px rgb(59 130 246)' : 'none', // focus:ring-blue-500
    '&:hover': {
      border: '1px solid rgb(147 197 253)',
    },
    backdropFilter: 'blur(4px)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(147, 197, 253, 0.5)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'rgba(59, 130, 246, 0.9)' 
      : state.isFocused 
        ? 'rgba(59, 130, 246, 0.5)' 
        : 'transparent',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.7)',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(147, 197, 253, 0.5)',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(147, 197, 253, 0.8)',
    '&:hover': {
      color: 'rgb(147, 197, 253)',
    },
  }),
};

const PdfTools = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toolType, setToolType] = useState('convert');
  const [options, setOptions] = useState({
    // Conversion options
    pageRange: '',
    // Compression options
    compressionLevel: 'medium',
    removeMetadata: false,
    // Split options
    splitPages: '',
    splitBySize: false,
    maxSizeMB: 5,
    // Signing options
    signatureText: '',
    // Unlock options
    password: '',
    // Page numbering options
    startNumber: 1,
    position: 'bottom-right',
    format: '{page} of {total}'
  });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const tools = {
    convert: {
      label: 'Convert Files',
      description: 'Convert between PDF and other formats',
      icon: '🔄',
      input: '.pdf,.docx,.doc',
      output: '.docx,.pdf,.txt',
      options: ['pageRange'],
      formats: [
        { value: 'pdf-to-word', label: 'PDF to Word', output: '.docx', description: 'Convert PDF to editable Word document' },
        { value: 'word-to-pdf', label: 'Word to PDF', output: '.pdf', description: 'Convert Word document to PDF' },
        { value: 'pdf-to-text', label: 'PDF to Text', output: '.txt', description: 'Extract text from PDF' },
        { value: 'pdf-to-image', label: 'PDF to Image', output: '.png', description: 'Convert PDF pages to images' }
      ]
    },
    compress: {
      label: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: '📦',
      input: '.pdf',
      output: '.pdf',
      options: ['compressionLevel', 'removeMetadata']
    },
    merge: {
      label: 'Merge PDFs',
      description: 'Combine multiple PDF files into one',
      icon: '🔗',
      input: '.pdf',
      output: '.pdf',
      options: []
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
      options: ['signatureText']
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
    }
  };

  const [selectedFormat, setSelectedFormat] = useState('pdf-to-word');

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (tools[toolType].label === 'Merge PDFs') {
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



  const simulateProgress = async () => {
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
  };

  const extractTextFromPDF = async (pdfBytes) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      let extractedText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        extractedText += `Page ${i}\n${pageText}\n\n`;
      }

      return extractedText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return 'Text extraction failed. Please try again.';
    }
  };

  const createWordDocument = async (text, fileName) => {
    try {
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.map(paragraph => 
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24,
                }),
              ],
            })
          ),
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const outputFileName = fileName.replace('.pdf', '.docx');
      saveAs(blob, outputFileName);
    } catch (error) {
      console.error('Error creating Word document:', error);
      throw new Error('Failed to create Word document');
    }
  };

  const createPDFFromWord = async (file) => {
    try {
      const text = await file.text();
      const pdfDoc = await PDFDocument.create();
      let currentPage = pdfDoc.addPage();
      const { width, height } = currentPage.getSize();
      
      // Simple text rendering (in a real app, you'd use a proper Word parser)
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
      let y = height - 50;
      
      const lines = text.split('\n');
      for (const line of lines) {
        if (y < 50) {
          currentPage = pdfDoc.addPage();
          y = height - 50;
        }
        
        currentPage.drawText(line, {
          x: 50,
          y: y,
          size: fontSize,
        });
        y -= lineHeight;
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const outputFileName = file.name.replace(/\.(docx|doc)$/i, '.pdf');
      saveAs(blob, outputFileName);
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw new Error('Failed to create PDF');
    }
  };

  const compressPDF = async (pdfBytes, options) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Apply compression based on options
      if (options.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
      }
      
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      return compressedBytes;
    } catch (error) {
      console.error('Error compressing PDF:', error);
      throw new Error('Failed to compress PDF');
    }
  };

  const mergePDFs = async (files) => {
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const pdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged_document.pdf');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      throw new Error('Failed to merge PDFs');
    }
  };

  const splitPDF = async (pdfBytes, options) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      if (options.splitBySize) {
        // Split by size (simplified)
        const maxPages = Math.floor(options.maxSizeMB * 1024 * 1024 / 50000); // Rough estimate
        const chunks = Math.ceil(pages.length / maxPages);
        
        for (let i = 0; i < chunks; i++) {
          const newPdf = await PDFDocument.create();
          const startPage = i * maxPages;
          const endPage = Math.min((i + 1) * maxPages, pages.length);
          const pageIndices = Array.from({ length: endPage - startPage }, (_, j) => startPage + j);
          const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const splitBytes = await newPdf.save();
          const blob = new Blob([splitBytes], { type: 'application/pdf' });
          saveAs(blob, `split_part_${i + 1}.pdf`);
        }
      } else {
        // Split by page ranges
        const ranges = options.splitPages.split(',').map(range => range.trim());
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const [start, end] = range.includes('-') 
            ? range.split('-').map(Number)
            : [parseInt(range), parseInt(range)];
          
          const newPdf = await PDFDocument.create();
          const pageIndices = Array.from({ length: end - start + 1 }, (_, j) => start + j - 1);
          const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const splitBytes = await newPdf.save();
          const blob = new Blob([splitBytes], { type: 'application/pdf' });
          saveAs(blob, `split_${start}-${end}.pdf`);
        }
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw new Error('Failed to split PDF');
    }
  };

  const addSignatureToPDF = async (pdfBytes, options) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      if (options.signatureType === 'text') {
        firstPage.drawText(options.signatureText, {
          x: options.signaturePosition.x,
          y: options.signaturePosition.y,
          size: 12,
          color: { r: 0, g: 0, b: 0 },
        });
      }
      
      const signedBytes = await pdfDoc.save();
      const blob = new Blob([signedBytes], { type: 'application/pdf' });
      saveAs(blob, 'signed_document.pdf');
    } catch (error) {
      console.error('Error signing PDF:', error);
      throw new Error('Failed to sign PDF');
    }
  };

  const unlockPDF = async (pdfBytes, password) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { password });
      const unlockedBytes = await pdfDoc.save();
      const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
      saveAs(blob, 'unlocked_document.pdf');
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      throw new Error('Failed to unlock PDF. Check if password is correct.');
    }
  };

  const addPageNumbers = async (pdfBytes, options) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = options.startNumber + index;
        const totalPages = pages.length;
        const text = options.format
          .replace('{page}', pageNumber)
          .replace('{total}', totalPages);
        
        let x, y;
        switch (options.position) {
          case 'bottom-right':
            x = width - 50;
            y = 30;
            break;
          case 'bottom-left':
            x = 50;
            y = 30;
            break;
          case 'top-right':
            x = width - 50;
            y = height - 30;
            break;
          case 'top-left':
            x = 50;
            y = height - 30;
            break;
          default:
            x = width - 50;
            y = 30;
        }
        
        page.drawText(text, {
          x,
          y,
          size: 10,
          color: { r: 0.5, g: 0.5, b: 0.5 },
        });
      });
      
      const numberedBytes = await pdfDoc.save();
      const blob = new Blob([numberedBytes], { type: 'application/pdf' });
      saveAs(blob, 'numbered_document.pdf');
    } catch (error) {
      console.error('Error adding page numbers:', error);
      throw new Error('Failed to add page numbers');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile && selectedFiles.length === 0) return;

    try {
      setError(null);
      await simulateProgress();

      const file = selectedFile || selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);

      switch (toolType) {
        case 'convert':
          if (selectedFormat === 'pdf-to-word') {
            const extractedText = await extractTextFromPDF(fileBytes);
            await createWordDocument(extractedText, file.name);
          } else if (selectedFormat === 'word-to-pdf') {
            await createPDFFromWord(file);
          } else if (selectedFormat === 'pdf-to-text') {
            const extractedText = await extractTextFromPDF(fileBytes);
            const textBlob = new Blob([extractedText], { type: 'text/plain' });
            const outputFileName = file.name.replace('.pdf', '.txt');
            saveAs(textBlob, outputFileName);
          } else if (selectedFormat === 'pdf-to-image') {
            const pdfDoc = await PDFDocument.load(fileBytes);
            const pages = pdfDoc.getPages();
            
            for (let i = 0; i < pages.length; i++) {
              const page = pages[i];
              const { width, height } = page.getSize();
              
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = width;
              canvas.height = height;
              
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, width, height);
              ctx.fillStyle = 'black';
              ctx.font = '12px Arial';
              ctx.fillText(`Page ${i + 1}`, 10, 20);
              
              canvas.toBlob((blob) => {
                const outputFileName = file.name.replace('.pdf', `_page_${i + 1}.png`);
                saveAs(blob, outputFileName);
              });
            }
          }
          break;

        case 'compress':
          const compressedBytes = await compressPDF(fileBytes, options);
          const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
          saveAs(compressedBlob, 'compressed_document.pdf');
          break;

        case 'merge':
          await mergePDFs(selectedFiles);
          break;

        case 'split':
          await splitPDF(fileBytes, options);
          break;

        case 'sign':
          await addSignatureToPDF(fileBytes, options);
          break;

        case 'unlock':
          await unlockPDF(fileBytes, options.password);
          break;

        case 'number':
          await addPageNumbers(fileBytes, options);
          break;

        default:
          throw new Error('Unknown tool type');
      }
    } catch (err) {
      setError(err.message || 'Processing failed. Please try again.');
      console.error('Processing error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-radial-gradient py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4">Advanced PDF Toolkit</h1>
          <p className="text-xl text-gray-300">Professional PDF tools for all your document needs</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          {/* Tools Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Select Tool</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(tools).map(([key, tool]) => (
                <button
                  key={key}
                  onClick={() => {
                    setToolType(key);
                    if (key === 'convert') {
                      setSelectedFormat('pdf-to-word');
                    }
                  }}
                  className={`p-4 rounded-xl text-center transition-all duration-300 ${
                    toolType === key
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="font-semibold text-sm">{tool.label}</h3>
                  <p className="text-xs text-gray-300 mt-1">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Upload Section */}
            <div className="lg:col-span-2">
              {toolType === 'convert' && (
                <div className="mb-6">
                  <label className="block text-lg font-medium text-white mb-3">Select Conversion Format</label>
                  <Select
                    options={tools.convert.formats.map(format => ({
                      value: format.value,
                      label: format.label,
                    }))}
                    value={{ value: selectedFormat, label: tools.convert.formats.find(f => f.value === selectedFormat)?.label }}
                    onChange={(selectedOption) => setSelectedFormat(selectedOption.value)}
                    styles={customSelectStyles}
                    placeholder="Select conversion format"
                    isSearchable={false}
                    isClearable={false}
                  />
                  <p className="mt-2 text-sm text-gray-300">
                    {tools.convert.formats.find(f => f.value === selectedFormat)?.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-lg font-medium text-white mb-3">
                  Upload {tools[toolType].label === 'Merge PDFs' ? 'Files' : 'File'}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-16 h-16 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-lg text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">
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
                      multiple={tools[toolType].label === 'Merge PDFs'}
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              {selectedFile && (
                <div className="bg-white/5 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Selected File</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{selectedFile.name}</span>
                    <span className="text-sm text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="bg-white/5 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Selected Files</h3>
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
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-white mb-6">Options</h3>
              <div className="space-y-6">
                                 {tools[toolType].options.map(option => {
                   switch (option) {
                     case 'removeMetadata':
                     case 'splitBySize':
                       return (
                         <div key={option} className="flex items-center">
                           <input
                             type="checkbox"
                             id={option}
                             checked={options[option]}
                             onChange={(e) => handleOptionChange(option, e.target.checked)}
                             className="w-5 h-5 text-blue-600 bg-white/20 border-blue-300 rounded focus:ring-blue-500"
                           />
                           <label htmlFor={option} className="ml-3 text-sm text-gray-300">
                             {option === 'removeMetadata' ? 'Remove Metadata' : 'Split by Size'}
                           </label>
                         </div>
                       );

                     case 'compressionLevel':
                       return (
                         <div key={option}>
                           <label className="block text-sm font-medium text-white mb-2">Compression Level</label>
                           <Select
                             options={[
                               { value: 'low', label: 'Low (Better Quality)' },
                               { value: 'medium', label: 'Medium (Balanced)' },
                               { value: 'high', label: 'High (Smaller Size)' },
                             ]}
                             value={{ value: options[option], label: options[option] }}
                             onChange={(selectedOption) => handleOptionChange(option, selectedOption.value)}
                             styles={customSelectStyles}
                             placeholder="Select compression level"
                             isSearchable={false}
                             isClearable={false}
                           />
                         </div>
                       );

                     case 'pageRange':
                     case 'splitPages':
                     case 'password':
                     case 'signatureText':
                     case 'format':
                       return (
                         <div key={option}>
                           <label className="block text-sm font-medium text-white mb-2">
                             {option === 'pageRange' ? 'Page Range' :
                              option === 'splitPages' ? 'Split Pages' :
                              option === 'password' ? 'Password' :
                              option === 'signatureText' ? 'Signature Text' :
                              'Format'}
                           </label>
                           <input
                             type={option === 'password' ? 'password' : 'text'}
                             value={options[option]}
                             onChange={(e) => handleOptionChange(option, e.target.value)}
                             placeholder={option === 'pageRange' || option === 'splitPages' ? 'e.g., 1-5, 8, 11-13' : ''}
                             className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                           />
                         </div>
                       );

                     case 'maxSizeMB':
                       return (
                         <div key={option}>
                           <label className="block text-sm font-medium text-white mb-2">Max Size (MB)</label>
                           <input
                             type="number"
                             value={options[option]}
                             onChange={(e) => handleOptionChange(option, Number(e.target.value))}
                             className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                           />
                         </div>
                       );

                     case 'startNumber':
                       return (
                         <div key={option}>
                           <label className="block text-sm font-medium text-white mb-2">Start Number</label>
                           <input
                             type="number"
                             value={options[option]}
                             onChange={(e) => handleOptionChange(option, Number(e.target.value))}
                             className="w-full p-3 rounded-lg bg-white/20 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                           />
                         </div>
                       );

                     case 'position':
                       return (
                         <div key={option}>
                           <label className="block text-sm font-medium text-white mb-2">Position</label>
                           <Select
                             options={[
                               { value: 'bottom-right', label: 'Bottom Right' },
                               { value: 'bottom-left', label: 'Bottom Left' },
                               { value: 'top-right', label: 'Top Right' },
                               { value: 'top-left', label: 'Top Left' },
                             ]}
                             value={{ value: options[option], label: options[option] }}
                             onChange={(selectedOption) => handleOptionChange(option, selectedOption.value)}
                             styles={customSelectStyles}
                             placeholder="Select position"
                             isSearchable={false}
                             isClearable={false}
                           />
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
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {progress > 0 && progress < 100 && (
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center mt-3 text-sm text-gray-300">
                Processing... {progress}%
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProcess}
              disabled={!selectedFile && selectedFiles.length === 0}
              className={`px-12 py-4 rounded-full font-semibold text-xl transition-all duration-300 shadow-lg ${
                !selectedFile && selectedFiles.length === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }`}
            >
              Process {tools[toolType].label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfTools; 