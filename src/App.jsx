import React from 'react'; // ✅ Required for JSX to work
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tools from './pages/Tools';
import QrGenerator from './pages/QrGenerator';
import UrlQrGenerator from './components/qr-types/UrlQrGenerator';
import GradientGenerator from './pages/GradientGenerator';
import ImageBackgroundRemover from './pages/ImageBackgroundRemover';
import VideoToMp3 from './pages/VideoToMp3';
import PdfToWord from './pages/PdfToWord';
import YtToMp3 from './pages/YtToMp3';
import ReelsDownloader from './pages/ReelsDownloader';
import TextToSpeech from './pages/TextToSpeech';
import SpeechToText from './pages/SpeechToText';
import ImageCompressor from './pages/ImageCompressor';
import CodeFormatter from './pages/CodeFormatter';
import ColorPaletteGenerator from './pages/ColorPaletteGenerator';
import UnitConverter from './pages/UnitConverter';
import ResumeBuilder from './pages/ResumeBuilder';
import TodoList from './pages/TodoList';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-radial-gradient flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/qr-generator/url" element={<UrlQrGenerator />} />
            <Route path="/gradient-generator" element={<GradientGenerator />} />
            <Route path="/image-background-remover" element={<ImageBackgroundRemover />} />
            <Route path="/video-to-mp3" element={<VideoToMp3 />} />
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/yt-to-mp3" element={<YtToMp3 />} />
            <Route path="/reels-downloader" element={<ReelsDownloader />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/speech-to-text" element={<SpeechToText />} />
            <Route path="/image-compressor" element={<ImageCompressor />} />
            <Route path="/code-formatter" element={<CodeFormatter />} />
            <Route path="/color-palette" element={<ColorPaletteGenerator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/todo-list" element={<TodoList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
