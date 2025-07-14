import React, { useState } from 'react';
import chroma from 'chroma-js';

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
              <select
                value={paletteType}
                onChange={e => setPaletteType(e.target.value)}
                className="w-full p-2 border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white"
              >
                {paletteTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
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
                <select
                  value={gradientType}
                  onChange={e => setGradientType(e.target.value)}
                  className="w-full p-2 border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white"
                >
                  {gradientTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
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