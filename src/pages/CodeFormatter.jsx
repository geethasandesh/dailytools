import React, { useState } from 'react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserPostcss from 'prettier/parser-postcss';
import beautify from 'js-beautify';
import vkbeautify from 'vkbeautify';
import DiffViewer from 'react-diff-viewer';
import Select from 'react-select';

// Custom styles for react-select to make it transparent
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgba(59, 130, 246, 0.5)', // border-blue-400/50
    borderRadius: '12px',
    boxShadow: state.isFocused ? '0 0 0 2px rgb(59 130 246)' : 'none', // focus:ring-blue-500
    '&:hover': {
      border: '1px solid rgba(59, 130, 246, 0.5)',
    },
    backdropFilter: 'blur(4px)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
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
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(59, 130, 246, 0.8)',
    '&:hover': {
      color: 'rgb(59, 130, 246)',
    },
  }),
};

const CodeFormatter = () => {
  const [tab, setTab] = useState('format');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formattedCode, setFormattedCode] = useState('');
  const [error, setError] = useState('');
  // For compare
  const [codeA, setCodeA] = useState('');
  const [codeB, setCodeB] = useState('');
  const [compareLang, setCompareLang] = useState('javascript');
  const [diffError, setDiffError] = useState('');

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'json', name: 'JSON' },
    { id: 'xml', name: 'XML' },
  ];

  const handleFormat = async () => {
    setError('');
    try {
      let formatted = '';
      if (language === 'javascript') {
        formatted = await prettier.format(code, {
          parser: 'babel',
          plugins: [parserBabel],
        });
      } else if (language === 'json') {
        formatted = await prettier.format(code, {
          parser: 'json',
          plugins: [parserBabel],
        });
      } else if (language === 'html') {
        formatted = await prettier.format(code, {
          parser: 'html',
          plugins: [parserHtml],
        });
      } else if (language === 'css') {
        formatted = await prettier.format(code, {
          parser: 'css',
          plugins: [parserPostcss],
        });
      } else if (language === 'python') {
        formatted = beautify.js_beautify(code, { indent_size: 4 });
      } else if (language === 'xml') {
        formatted = vkbeautify.xml(code, 2);
      } else {
        formatted = code;
      }
      setFormattedCode(formatted);
    } catch (err) {
      setError('Formatting failed: ' + err.message);
      setFormattedCode('');
    }
  };

  const handleCompare = async () => {
    setDiffError('');
    try {
      let a = codeA;
      let b = codeB;
      if (compareLang === 'javascript') {
        a = await prettier.format(codeA, { parser: 'babel', plugins: [parserBabel] });
        b = await prettier.format(codeB, { parser: 'babel', plugins: [parserBabel] });
      } else if (compareLang === 'json') {
        a = await prettier.format(codeA, { parser: 'json', plugins: [parserBabel] });
        b = await prettier.format(codeB, { parser: 'json', plugins: [parserBabel] });
      } else if (compareLang === 'html') {
        a = await prettier.format(codeA, { parser: 'html', plugins: [parserHtml] });
        b = await prettier.format(codeB, { parser: 'html', plugins: [parserHtml] });
      } else if (compareLang === 'css') {
        a = await prettier.format(codeA, { parser: 'css', plugins: [parserPostcss] });
        b = await prettier.format(codeB, { parser: 'css', plugins: [parserPostcss] });
      } else if (compareLang === 'python') {
        a = beautify.js_beautify(codeA, { indent_size: 4 });
        b = beautify.js_beautify(codeB, { indent_size: 4 });
      } else if (compareLang === 'xml') {
        a = vkbeautify.xml(codeA, 2);
        b = vkbeautify.xml(codeB, 2);
      }
      setCodeA(a);
      setCodeB(b);
    } catch (err) {
      setDiffError('Formatting failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          Code Formatter & Comparison
        </h1>
        <div className="mb-8 flex justify-center gap-4">
          <button
            className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${tab === 'format' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            onClick={() => setTab('format')}
          >
            Format
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${tab === 'compare' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            onClick={() => setTab('compare')}
          >
            Compare
          </button>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          {tab === 'format' && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Select Language
                </label>
                <Select
                  options={[
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'html', label: 'HTML' },
                    { value: 'css', label: 'CSS' },
                    { value: 'json', label: 'JSON' },
                    { value: 'xml', label: 'XML' },
                    { value: 'sql', label: 'SQL' },
                    { value: 'python', label: 'Python' },
                    { value: 'java', label: 'Java' },
                    { value: 'cpp', label: 'C++' },
                    { value: 'csharp', label: 'C#' },
                  ]}
                  value={{ value: language, label: language.charAt(0).toUpperCase() + language.slice(1) }}
                  onChange={(selectedOption) => setLanguage(selectedOption.value)}
                  styles={customSelectStyles}
                  placeholder="Select language"
                  isSearchable={false}
                  isClearable={false}
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Your Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-3 font-mono text-sm border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                  placeholder="Paste your code here..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleFormat}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  Format Code
                </button>
                <button
                  onClick={() => {
                    setCode('');
                    setFormattedCode('');
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Clear
                </button>
              </div>
              {error && (
                <div className="mt-4 text-red-400 font-semibold">
                  {error}
                </div>
              )}
              {formattedCode && !error && (
                <div className="mt-6">
                  <label className="block text-lg font-semibold text-white mb-2">
                    Formatted Code
                  </label>
                  <pre className="w-full p-3 font-mono text-sm bg-white/5 border border-blue-400/50 rounded-xl overflow-x-auto text-white">
                    {formattedCode}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(formattedCode);
                    }}
                    className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </>
          )}
          {tab === 'compare' && (
            <>
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Code A
                  </label>
                  <textarea
                    value={codeA}
                    onChange={(e) => setCodeA(e.target.value)}
                    className="w-full h-64 p-3 font-mono text-sm border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                    placeholder="Paste first code here..."
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-white mb-2">
                    Code B
                  </label>
                  <textarea
                    value={codeB}
                    onChange={(e) => setCodeB(e.target.value)}
                    className="w-full h-64 p-3 font-mono text-sm border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                    placeholder="Paste second code here..."
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Select Language
                </label>
                <Select
                  options={[
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'html', label: 'HTML' },
                    { value: 'css', label: 'CSS' },
                    { value: 'json', label: 'JSON' },
                    { value: 'xml', label: 'XML' },
                    { value: 'sql', label: 'SQL' },
                    { value: 'python', label: 'Python' },
                    { value: 'java', label: 'Java' },
                    { value: 'cpp', label: 'C++' },
                    { value: 'csharp', label: 'C#' },
                  ]}
                  value={{ value: compareLang, label: compareLang.charAt(0).toUpperCase() + compareLang.slice(1) }}
                  onChange={(selectedOption) => setCompareLang(selectedOption.value)}
                  styles={customSelectStyles}
                  placeholder="Select language"
                  isSearchable={false}
                  isClearable={false}
                />
              </div>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleCompare}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  Compare Code
                </button>
                <button
                  onClick={() => {
                    setCodeA('');
                    setCodeB('');
                    setDiffError('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Clear
                </button>
              </div>
              {diffError && (
                <div className="mt-4 text-red-400 font-semibold">
                  {diffError}
                </div>
              )}
              <div className="mt-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Code Difference
                </label>
                <div className="rounded-xl overflow-x-auto bg-white/5 border border-blue-400/50">
                  <DiffViewer
                    oldValue={codeA}
                    newValue={codeB}
                    splitView={true}
                    showDiffOnly={false}
                    leftTitle="Code A"
                    rightTitle="Code B"
                    styles={{
                      variables: {
                        light: {
                          diffViewerBackground: '#f3f4f6',
                          addedBackground: '#bbf7d0',
                          removedBackground: '#fecaca',
                        },
                        dark: {
                          diffViewerBackground: '#18181b',
                          addedBackground: '#166534',
                          removedBackground: '#7f1d1d',
                        },
                      },
                      diffContainer: { background: 'transparent' },
                      lineNumber: { color: '#a5b4fc' },
                      contentText: { color: '#fff' },
                      gutter: { background: 'transparent' },
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeFormatter; 