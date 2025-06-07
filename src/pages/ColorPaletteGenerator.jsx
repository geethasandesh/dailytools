import React, { useState } from 'react';

const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [palette, setPalette] = useState([]);

  const generatePalette = () => {
    // TODO: Implement color palette generation
    const mockPalette = [
      { color: '#3B82F6', name: 'Primary' },
      { color: '#60A5FA', name: 'Light' },
      { color: '#2563EB', name: 'Dark' },
      { color: '#DBEAFE', name: 'Background' },
      { color: '#1E40AF', name: 'Accent' },
    ];
    setPalette(mockPalette);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Color Palette Generator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-12 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generatePalette}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Generate Palette
        </button>

        {palette.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Generated Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md"
                >
                  <div
                    className="w-12 h-12 rounded-md"
                    style={{ backgroundColor: color.color }}
                  />
                  <div>
                    <p className="font-medium">{color.name}</p>
                    <p className="text-sm text-gray-500">{color.color}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(color.color);
                    }}
                    className="ml-auto px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPaletteGenerator; 