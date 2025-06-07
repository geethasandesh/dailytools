import React, { useState } from 'react';

const CodeFormatter = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formattedCode, setFormattedCode] = useState('');

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'json', name: 'JSON' },
    { id: 'xml', name: 'XML' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Code Formatter</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your code here..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              // TODO: Implement code formatting
              setFormattedCode(code);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Format Code
          </button>
          <button
            onClick={() => {
              setCode('');
              setFormattedCode('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>

        {formattedCode && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formatted Code
            </label>
            <pre className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md overflow-x-auto">
              {formattedCode}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formattedCode);
              }}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeFormatter; 