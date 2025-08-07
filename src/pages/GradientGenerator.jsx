// src/pages/GradientGenerator.jsx

import React, { useState } from 'react';
import Select from 'react-select';

// Custom styles for react-select to make it transparent
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid rgba(59, 130, 246, 0.5)', // border-blue-400/50
    borderRadius: '8px',
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
    borderRadius: '8px',
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
        <Select
          options={[
            { value: 'to right', label: 'Horizontal' },
            { value: 'to bottom', label: 'Vertical' },
            { value: '45deg', label: 'Diagonal' },
            { value: 'to top right', label: 'Top Right' },
            { value: 'to bottom right', label: 'Bottom Right' },
          ]}
          value={{ value: direction, label: direction === 'to right' ? 'Horizontal' : direction === 'to bottom' ? 'Vertical' : direction === '45deg' ? 'Diagonal' : direction === 'to top right' ? 'Top Right' : 'Bottom Right' }}
          onChange={(selectedOption) => setDirection(selectedOption.value)}
          styles={customSelectStyles}
          placeholder="Select direction"
          isSearchable={false}
          isClearable={false}
          className="ml-2"
        />
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
