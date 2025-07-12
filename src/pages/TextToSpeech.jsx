import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const voicerssLanguages = [
  { value: 'ar-sa', label: 'Arabic (Saudi Arabia)' },
  { value: 'ca-es', label: 'Catalan (Spain)' },
  { value: 'zh-cn', label: 'Chinese (China)' },
  { value: 'zh-hk', label: 'Chinese (Hong Kong)' },
  { value: 'zh-tw', label: 'Chinese (Taiwan)' },
  { value: 'da-dk', label: 'Danish (Denmark)' },
  { value: 'nl-be', label: 'Dutch (Belgium)' },
  { value: 'nl-nl', label: 'Dutch (Netherlands)' },
  { value: 'en-au', label: 'English (Australia)' },
  { value: 'en-ca', label: 'English (Canada)' },
  { value: 'en-gb', label: 'English (Great Britain)' },
  { value: 'en-in', label: 'English (India)' },
  { value: 'en-ie', label: 'English (Ireland)' },
  { value: 'en-nz', label: 'English (New Zealand)' },
  { value: 'en-us', label: 'English (United States)' },
  { value: 'en-za', label: 'English (South Africa)' },
  { value: 'fi-fi', label: 'Finnish (Finland)' },
  { value: 'fr-ca', label: 'French (Canada)' },
  { value: 'fr-fr', label: 'French (France)' },
  { value: 'de-de', label: 'German (Germany)' },
  { value: 'it-it', label: 'Italian (Italy)' },
  { value: 'ja-jp', label: 'Japanese (Japan)' },
  { value: 'ko-kr', label: 'Korean (Korea)' },
  { value: 'nb-no', label: 'Norwegian (Norway)' },
  { value: 'pl-pl', label: 'Polish (Poland)' },
  { value: 'pt-br', label: 'Portuguese (Brazil)' },
  { value: 'pt-pt', label: 'Portuguese (Portugal)' },
  { value: 'ru-ru', label: 'Russian (Russia)' },
  { value: 'es-mx', label: 'Spanish (Mexico)' },
  { value: 'es-es', label: 'Spanish (Spain)' },
  { value: 'sv-se', label: 'Swedish (Sweden)' },
  { value: 'hi-in', label: 'Hindi (India)' },
  { value: 'tr-tr', label: 'Turkish (Turkey)' },
  { value: 'el-gr', label: 'Greek (Greece)' },
  { value: 'cs-cz', label: 'Czech (Czech Republic)' },
  { value: 'ro-ro', label: 'Romanian (Romania)' },
  { value: 'sk-sk', label: 'Slovak (Slovakia)' },
  { value: 'hu-hu', label: 'Hungarian (Hungary)' },
  { value: 'th-th', label: 'Thai (Thailand)' },
  { value: 'bg-bg', label: 'Bulgarian (Bulgaria)' },
  { value: 'hr-hr', label: 'Croatian (Croatia)' },
  { value: 'lt-lt', label: 'Lithuanian (Lithuania)' },
  { value: 'lv-lv', label: 'Latvian (Latvia)' },
  { value: 'sr-rs', label: 'Serbian (Serbia)' },
  { value: 'sl-si', label: 'Slovenian (Slovenia)' },
  { value: 'et-ee', label: 'Estonian (Estonia)' },
  { value: 'te-in', label: 'Telugu (India)' },
];

// VoiceRSS voices per language (partial, add more as needed)
const voicerssVoices = {
  'en-us': [
    { value: '', label: 'Default' },
    { value: 'Linda', label: 'Linda (Female)' },
    { value: 'John', label: 'John (Male)' },
    { value: 'Mary', label: 'Mary (Female)' },
    { value: 'Mike', label: 'Mike (Male)' },
    { value: 'Amy', label: 'Amy (Female)' },
    { value: 'Brian', label: 'Brian (Male)' },
  ],
  'en-gb': [
    { value: '', label: 'Default' },
    { value: 'Amy', label: 'Amy (Female)' },
    { value: 'Brian', label: 'Brian (Male)' },
  ],
  'hi-in': [
    { value: '', label: 'Default' },
    { value: 'Aditi', label: 'Aditi (Female)' },
  ],
  'es-es': [
    { value: '', label: 'Default' },
    { value: 'Conchita', label: 'Conchita (Female)' },
    { value: 'Enrique', label: 'Enrique (Male)' },
  ],
  'fr-fr': [
    { value: '', label: 'Default' },
    { value: 'Celine', label: 'Celine (Female)' },
    { value: 'Mathieu', label: 'Mathieu (Male)' },
  ],
  'de-de': [
    { value: '', label: 'Default' },
    { value: 'Marlene', label: 'Marlene (Female)' },
    { value: 'Hans', label: 'Hans (Male)' },
  ],
  'it-it': [
    { value: '', label: 'Default' },
    { value: 'Carla', label: 'Carla (Female)' },
    { value: 'Giorgio', label: 'Giorgio (Male)' },
  ],
  'te-in': [
    { value: '', label: 'Default' } // Only default for Telugu
  ],
  // ...add more as needed
};

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState({ value: '', label: 'Default' });
  const [voices, setVoices] = useState(voicerssVoices['en-us']);
  const [speechRate, setSpeechRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [lang, setLang] = useState(voicerssLanguages.find(l => l.value === 'en-us'));

  useEffect(() => {
    // Update voices when language changes
    setVoices(voicerssVoices[lang.value] || [{ value: '', label: 'Default' }]);
    setSelectedVoice({ value: '', label: 'Default' });
  }, [lang]);

  React.useEffect(() => {
    // Get available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for English voices and categorize them
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en') || voice.lang.startsWith('en-US')
      );
      // Sort voices: female voices first, then male voices
      const sortedVoices = englishVoices.sort((a, b) => {
        const aIsFemale = a.name.toLowerCase().includes('female') || 
                         a.name.toLowerCase().includes('woman') || 
                         a.name.toLowerCase().includes('girl');
        const bIsFemale = b.name.toLowerCase().includes('female') || 
                         b.name.toLowerCase().includes('woman') || 
                         b.name.toLowerCase().includes('girl');
        if (aIsFemale && !bIsFemale) return -1;
        if (!aIsFemale && bIsFemale) return 1;
        return a.name.localeCompare(b.name);
      });
      setVoices(sortedVoices);
      if (sortedVoices.length > 0) {
        setSelectedVoice(sortedVoices[0]);
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    utterance.pitch = pitch;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleDownload = async () => {
    if (!text) return;
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: lang.value,
          voice: selectedVoice.value,
          rate: Math.round((speechRate - 1) * 10).toString()
        })
      });
      if (!response.ok) {
        alert('Failed to generate audio');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tts.mp3';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading audio');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          Text to Speech Converter
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-white mb-2">Select Language</label>
              <Select
                options={voicerssLanguages}
                value={lang}
                onChange={setLang}
                classNamePrefix="react-select"
                isSearchable
                styles={{
                  control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '3rem', background: 'rgba(255,255,255,0.1)', borderColor: '#7c3aed', color: 'white' }),
                  singleValue: (base) => ({ ...base, color: 'white' }),
                  menu: (base) => ({ ...base, borderRadius: '1rem', background: '#18181b', color: 'white' }),
                  option: (base, state) => ({ ...base, background: state.isSelected ? '#7c3aed' : state.isFocused ? '#a78bfa' : 'transparent', color: state.isSelected ? 'white' : 'white' }),
                  input: (base) => ({ ...base, color: 'white' }),
                }}
              />
            </div>
            {/* Voice Selection */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-white mb-2">Select Voice</label>
              <Select
                options={voices}
                value={selectedVoice}
                onChange={setSelectedVoice}
                classNamePrefix="react-select"
                isSearchable
                styles={{
                  control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '3rem', background: 'rgba(255,255,255,0.1)', borderColor: '#7c3aed', color: 'white' }),
                  singleValue: (base) => ({ ...base, color: 'white' }),
                  menu: (base) => ({ ...base, borderRadius: '1rem', background: '#18181b', color: 'white' }),
                  option: (base, state) => ({ ...base, background: state.isSelected ? '#7c3aed' : state.isFocused ? '#a78bfa' : 'transparent', color: state.isSelected ? 'white' : 'white' }),
                  input: (base) => ({ ...base, color: 'white' }),
                }}
              />
            </div>
            {/* Text Input Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white mb-3">
                Enter Your Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 p-4 bg-white/5 border border-blue-400/50 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Type or paste your text here to convert it to speech..."
              />
            </div>
            {/* Speech Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-white font-medium">
                  Speech Rate: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-white font-medium">
                  Pitch: {pitch}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={speak}
                disabled={!text || isSpeaking}
                className={`flex-1 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  !text || isSpeaking
                    ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                }`}
              >
                {isSpeaking ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Speaking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    🔊 Speak Text
                  </span>
                )}
              </button>
              <button
                onClick={stop}
                disabled={!isSpeaking}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  !isSpeaking
                    ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg'
                }`}
              >
                ⏹️ Stop
              </button>
            </div>
            {/* Download Button */}
            <div className="pt-4">
              <button
                onClick={handleDownload}
                disabled={!text}
                className="w-full px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  📥 Download Audio (MP3)
                </span>
              </button>
            </div>
            {/* Current Voice Info */}
            {selectedVoice && (
              <div className="bg-white/5 rounded-2xl p-4 border border-blue-400/50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <p className="text-white font-medium">{selectedVoice.label}</p>
                    <p className="text-sm text-gray-400">Language: {lang.label}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech; 