// src/pages/GradientGenerator.jsx

import React, { useState } from 'react';

export default function GradientGenerator() {
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#0000ff');
  const [direction, setDirection] = useState('to right');

  const gradientStyle = {
    background: `linear-gradient(${direction}, ${color1}, ${color2})`,
    height: '200px',
    width: '100%',
    borderRadius: '0.5rem',
  };

  return (
    <div className="max-w-lg mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Gradient Generator</h2>
      
      <div className="flex justify-between items-center gap-4 mb-4">
        <label>
          Color 1:
          <input type="color" value={color1} onChange={e => setColor1(e.target.value)} />
        </label>
        <label>
          Color 2:
          <input type="color" value={color2} onChange={e => setColor2(e.target.value)} />
        </label>
      </div>

      <label className="block mb-4">
        Direction:
        <select
          className="ml-2 p-1 border rounded"
          value={direction}
          onChange={e => setDirection(e.target.value)}
        >
          <option value="to right">Right</option>
          <option value="to left">Left</option>
          <option value="to bottom">Down</option>
          <option value="to top">Up</option>
          <option value="45deg">Diagonal (45°)</option>
        </select>
      </label>

      <div style={gradientStyle}></div>

      <div className="mt-4">
        <code className="bg-gray-100 p-2 rounded block text-sm">
          background: linear-gradient({direction}, {color1}, {color2});
        </code>
      </div>
    </div>
  );
}
