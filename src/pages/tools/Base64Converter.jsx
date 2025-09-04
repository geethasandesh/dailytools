import React, { useState } from 'react';

const Base64Converter = () => {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text to convert');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch (err) {
      setError('Invalid input for ' + mode + 'ing');
      setOutput('');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">Base64 Converter</h1>
          <p className="text-base text-purple-200">Encode and decode Base64 strings</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="mb-6 flex justify-center gap-3">
            <button
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${mode === 'encode' ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10'}`}
              onClick={() => setMode('encode')}
            >
              Encode
            </button>
            <button
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${mode === 'decode' ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10'}`}
              onClick={() => setMode('decode')}
            >
              Decode
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-white mb-3">
              {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30 bg-white/5 text-white placeholder-gray-400 resize-none"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            />
          </div>

          <button
            onClick={handleConvert}
            className="w-full px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-all duration-200"
          >
            {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {output && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-white">Result</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-xs hover:bg-green-500/30 transition-all duration-200"
                >
                  Copy
                </button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-24 p-3 border border-white/20 rounded-xl bg-white/5 text-white font-mono text-sm resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;