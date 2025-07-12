import React, { useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [pitch, setPitch] = useState(1);

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
          lang: 'en-us',
          voice: selectedVoice ? selectedVoice.name : '',
          rate: Math.round((speechRate - 1) * 10).toString() // VoiceRSS expects -10 to 10
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

  const isFemaleVoice = (voice) => {
    return voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') || 
           voice.name.toLowerCase().includes('girl');
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          Text to Speech Converter
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-blue-400">
          <div className="space-y-6">
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
            {/* Voice Selection Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white mb-3">
                Select Voice
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-purple-300 font-medium">👩 Female Voices</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {voices.filter(isFemaleVoice).map((voice) => (
                      <button
                        key={voice.name}
                        onClick={() => setSelectedVoice(voice)}
                        className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                          selectedVoice?.name === voice.name
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm opacity-75">{voice.lang}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-blue-300 font-medium">👨 Male Voices</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {voices.filter(voice => !isFemaleVoice(voice)).map((voice) => (
                      <button
                        key={voice.name}
                        onClick={() => setSelectedVoice(voice)}
                        className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                          selectedVoice?.name === voice.name
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm opacity-75">{voice.lang}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
                  <span className="text-2xl">
                    {isFemaleVoice(selectedVoice) ? '👩' : '👨'}
                  </span>
                  <div>
                    <p className="text-white font-medium">{selectedVoice.name}</p>
                    <p className="text-sm text-gray-400">Language: {selectedVoice.lang}</p>
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