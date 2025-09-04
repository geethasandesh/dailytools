import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
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

const paletteTypes = [
  { id: 'complementary', name: 'Complementary' },
  { id: 'analogous', name: 'Analogous' },
  { id: 'triadic', name: 'Triadic' },
  { id: 'tetradic', name: 'Tetradic' },
  { id: 'monochromatic', name: 'Monochromatic' },
];

const gradientTypes = [
  { id: 'linear', name: 'Linear Gradient' },
  { id: 'radial', name: 'Radial Gradient' },
  { id: 'conic', name: 'Conic Gradient' },
  { id: 'repeating-linear', name: 'Repeating Linear Gradient' },
  { id: 'repeating-radial', name: 'Repeating Radial Gradient' },
];

const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [paletteType, setPaletteType] = useState('complementary');
  const [palette, setPalette] = useState([]);
  const [gradientType, setGradientType] = useState('linear');
  const [gradient, setGradient] = useState('');
  const [editingColorIdx, setEditingColorIdx] = useState(null);

  const generatePalette = () => {
    let colors = [];
    try {
      const base = chroma(baseColor);
      if (paletteType === 'complementary') {
        colors = [base.hex(), base.set('hsl.h', "+180").hex()];
      } else if (paletteType === 'analogous') {
        colors = chroma.scale([base.set('hsl.h', '-30'), base.hex(), base.set('hsl.h', '+30')]).colors(5);
      } else if (paletteType === 'triadic') {
        colors = [
          base.hex(),
          base.set('hsl.h', '+120').hex(),
          base.set('hsl.h', '-120').hex(),
        ];
      } else if (paletteType === 'tetradic') {
        colors = [
          base.hex(),
          base.set('hsl.h', '+90').hex(),
          base.set('hsl.h', '+180').hex(),
          base.set('hsl.h', '+270').hex(),
        ];
      } else if (paletteType === 'monochromatic') {
        colors = chroma.scale([base.brighten(2), base.darken(2)]).colors(5);
      }
      setPalette(colors.map((color, i) => ({ color, name: `Color ${i + 1}` })));
    } catch (e) {
      setPalette([]);
    }
  };

  const handlePaletteColorChange = (idx, newColor) => {
    const newPalette = palette.map((c, i) => i === idx ? { ...c, color: newColor } : c);
    setPalette(newPalette);
    setEditingColorIdx(null);
  };

  const generateGradient = () => {
    if (palette.length < 2) return setGradient('');
    const colorList = palette.map(c => c.color).join(', ');
    switch (gradientType) {
      case 'linear':
        setGradient(`linear-gradient(90deg, ${colorList})`);
        break;
      case 'radial':
        setGradient(`radial-gradient(circle, ${colorList})`);
        break;
      case 'conic':
        setGradient(`conic-gradient(${colorList})`);
        break;
      case 'repeating-linear':
        setGradient(`repeating-linear-gradient(90deg, ${colorList})`);
        break;
      case 'repeating-radial':
        setGradient(`repeating-radial-gradient(circle, ${colorList})`);
        break;
      default:
        setGradient('');
    }
  };

  React.useEffect(() => {
    generatePalette();
    // eslint-disable-next-line
  }, [baseColor, paletteType]);

  React.useEffect(() => {
    generateGradient();
    // eslint-disable-next-line
  }, [palette, gradientType]);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          Color Palette & Gradient Generator
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-white mb-2">Base Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-blue-400"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 p-2 border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold text-white mb-2">Palette Type</label>
              <Select
                options={[
                  { value: 'monochromatic', label: 'Monochromatic' },
                  { value: 'analogous', label: 'Analogous' },
                  { value: 'complementary', label: 'Complementary' },
                  { value: 'triadic', label: 'Triadic' },
                  { value: 'tetradic', label: 'Tetradic' },
                  { value: 'split-complementary', label: 'Split Complementary' },
                ]}
                value={{ value: paletteType, label: paletteType.charAt(0).toUpperCase() + paletteType.slice(1).replace('-', ' ') }}
                onChange={(selectedOption) => setPaletteType(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select palette type"
                isSearchable={false}
                isClearable={false}
              />
            </div>
          </div>
          <div className="mb-6">
            <button
              onClick={generatePalette}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700"
            >
              Generate Palette
            </button>
          </div>
          {palette.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated Palette</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-blue-400/50 rounded-2xl bg-white/10"
                  >
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-white cursor-pointer"
                        style={{ backgroundColor: color.color }}
                        title="Click to pick a custom color"
                        onClick={() => setEditingColorIdx(index)}
                      />
                      {editingColorIdx === index && (
                        <input
                          type="color"
                          value={color.color}
                          onChange={e => handlePaletteColorChange(index, e.target.value)}
                          className="absolute top-0 left-0 w-12 h-12 opacity-100 z-10 border-none outline-none cursor-pointer"
                          style={{ boxShadow: '0 0 0 2px #fff' }}
                          autoFocus
                          onBlur={() => setEditingColorIdx(null)}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{color.name}</p>
                      <p className="text-sm text-blue-200">{color.color}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(color.color);
                      }}
                      className="ml-auto px-2 py-1 text-sm text-blue-200 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Gradient Generator */}
          {palette.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Gradient Generator</h2>
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white mb-2">Gradient Type</label>
                <Select
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'radial', label: 'Radial' },
                    { value: 'conic', label: 'Conic' },
                  ]}
                  value={{ value: gradientType, label: gradientType.charAt(0).toUpperCase() + gradientType.slice(1) }}
                  onChange={(selectedOption) => setGradientType(selectedOption.value)}
                  styles={customSelectStyles}
                  placeholder="Select gradient type"
                  isSearchable={false}
                  isClearable={false}
                />
              </div>
              <div className="w-full h-32 rounded-2xl border-2 border-blue-400 mb-4" style={{ background: gradient }} />
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={gradient}
                  readOnly
                  className="flex-1 p-2 border border-blue-400/50 rounded-xl bg-white/5 text-white"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(gradient)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  Copy CSS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGenerator; 