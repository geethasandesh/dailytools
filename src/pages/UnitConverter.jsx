import React, { useState, useEffect } from 'react';
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

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const categories = {
    length: {
      name: 'Length',
      units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'inch', 'foot', 'yard', 'mile'],
    },
    weight: {
      name: 'Weight',
      units: ['kilogram', 'gram', 'milligram', 'pound', 'ounce'],
    },
    temperature: {
      name: 'Temperature',
      units: ['celsius', 'fahrenheit', 'kelvin'],
    },
    currency: {
      name: 'Currency',
      units: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
    },
  };

  // Conversion factors for length (to meters)
  const lengthFactors = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  };

  // Conversion factors for weight (to kilograms)
  const weightFactors = {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
  };

  // Static currency rates (1 USD = ...)
  const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155,
    INR: 83,
  };

  function convert() {
    let val = parseFloat(value);
    if (isNaN(val)) return setResult('Please enter a valid number.');
    if (!fromUnit || !toUnit) return setResult('Please select both units.');
    let res = '';
    if (category === 'length') {
      // Convert from -> meters -> to
      const meters = val * lengthFactors[fromUnit];
      res = meters / lengthFactors[toUnit];
      setResult(`${val} ${fromUnit} = ${res} ${toUnit}`);
    } else if (category === 'weight') {
      const kg = val * weightFactors[fromUnit];
      res = kg / weightFactors[toUnit];
      setResult(`${val} ${fromUnit} = ${res} ${toUnit}`);
    } else if (category === 'temperature') {
      let tempC;
      // Convert to Celsius first
      if (fromUnit === 'celsius') tempC = val;
      else if (fromUnit === 'fahrenheit') tempC = (val - 32) * 5/9;
      else if (fromUnit === 'kelvin') tempC = val - 273.15;
      // Convert from Celsius to target
      if (toUnit === 'celsius') res = tempC;
      else if (toUnit === 'fahrenheit') res = tempC * 9/5 + 32;
      else if (toUnit === 'kelvin') res = tempC + 273.15;
      setResult(`${val} ${fromUnit} = ${res} ${toUnit}`);
    } else if (category === 'currency') {
      // Convert from -> USD -> to
      const usd = val / currencyRates[fromUnit];
      res = usd * currencyRates[toUnit];
      setResult(`${val} ${fromUnit} = ${res} ${toUnit}`);
    } else {
      setResult('Conversion not supported.');
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">Unit Converter</h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-white mb-2">Category</label>
            <Select
              options={Object.keys(categories).map(cat => ({ value: cat, label: categories[cat].name }))}
              value={{ value: category, label: categories[category].name }}
              onChange={(selectedOption) => setCategory(selectedOption.value)}
              styles={customSelectStyles}
              placeholder="Select category"
              isSearchable={false}
              isClearable={false}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-white mb-2">From</label>
              <Select
                options={categories[category] ? categories[category].units.map(unit => ({ value: unit, label: unit })) : []}
                value={{ value: fromUnit, label: fromUnit }}
                onChange={(selectedOption) => setFromUnit(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select unit"
                isSearchable={false}
                isClearable={false}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-white mb-2">To</label>
              <Select
                options={categories[category] ? categories[category].units.map(unit => ({ value: unit, label: unit })) : []}
                value={{ value: toUnit, label: toUnit }}
                onChange={(selectedOption) => setToUnit(selectedOption.value)}
                styles={customSelectStyles}
                placeholder="Select unit"
                isSearchable={false}
                isClearable={false}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-white mb-2">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border border-blue-400/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-300"
              placeholder="Enter value"
            />
          </div>
          <button
            onClick={convert}
            disabled={!fromUnit || !toUnit || !value}
            className={`w-full mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 ${!fromUnit || !toUnit || !value ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Convert
          </button>
          {result && (
            <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-blue-400/50 text-white">
              <h2 className="text-xl font-bold mb-2">Result</h2>
              <p className="text-lg">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter; 