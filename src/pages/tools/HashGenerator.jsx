import React, { useState } from 'react';
import Select from 'react-select';

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 255, 255, 0.3)' : 'none',
    '&:hover': { border: '1px solid rgba(255, 255, 255, 0.3)' },
    backdropFilter: 'blur(4px)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(255, 255, 255, 0.2)' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
  }),
  singleValue: (provided) => ({ ...provided, color: 'white' }),
  input: (provided) => ({ ...provided, color: 'white' }),
  placeholder: (provided) => ({ ...provided, color: 'rgba(255, 255, 255, 0.7)' }),
};

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [result, setResult] = useState('');

  const hashOptions = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha512', label: 'SHA-512' },
  ];

  const generateHash = async () => {
    if (!input.trim()) {
      setResult('Please enter text to hash');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      let hashBuffer;
      switch (hashType) {
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          // MD5 fallback (simplified)
          setResult('MD5 not supported in this browser. Use SHA-256 instead.');
          return;
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setResult(hashHex);
    } catch (error) {
      setResult('Error generating hash');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">Hash Generator</h1>
          <p className="text-base text-purple-200">Generate secure hashes for your text</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="mb-6">
            <label className="block text-base font-medium text-white mb-3">Hash Algorithm</label>
            <Select
              options={hashOptions}
              value={hashOptions.find(opt => opt.value === hashType)}
              onChange={(opt) => setHashType(opt.value)}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-white mb-3">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30 bg-white/5 text-white placeholder-gray-400 resize-none"
              placeholder="Enter text to hash..."
            />
          </div>

          <button
            onClick={generateHash}
            className="w-full px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-all duration-200"
          >
            Generate Hash
          </button>

          {result && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-white">Result</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-xs hover:bg-green-500/30 transition-all duration-200"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-300 font-mono break-all">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;