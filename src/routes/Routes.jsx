import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tools from '../pages/Tools';
import QrGenerator from '../pages/QrGenerator';
import UrlQrGenerator from '../components/qr-types/UrlQrGenerator';
import WhatsAppQrGenerator from '../components/qr-types/WhatsAppQrGenerator';
import EmailQrGenerator from '../components/qr-types/EmailQrGenerator';
import YoutubeQrGenerator from '../components/qr-types/YoutubeQrGenerator';
import LocationQrGenerator from '../components/qr-types/LocationQrGenerator';
import TextQrGenerator from '../components/qr-types/TextQrGenerator';
import InstagramQrGenerator from '../components/qr-types/InstagramQrGenerator';
import GradientGenerator from '../pages/GradientGenerator';
import VideoToMp3 from '../pages/VideoToMp3';
import PdfToWord from '../pages/PdfToWord';
import ImageBackgroundRemover from '../pages/ImageBackgroundRemover';
import ImageCompressor from '../pages/ImageCompressor';
import CodeFormatter from '../pages/CodeFormatter';
import ColorPaletteGenerator from '../pages/ColorPaletteGenerator';
import UnitConverter from '../pages/UnitConverter';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/qr-generator" element={<QrGenerator />} />
      <Route path="/qr-generator/url" element={<UrlQrGenerator />} />
      <Route path="/qr-generator/whatsapp" element={<WhatsAppQrGenerator />} />
      <Route path="/qr-generator/youtube" element={<YoutubeQrGenerator />} />
      <Route path="/qr-generator/email" element={<EmailQrGenerator />} />
      <Route path="/qr-generator/location" element={<LocationQrGenerator />} />
      <Route path="/qr-generator/text" element={<TextQrGenerator />} />
      <Route path="/qr-generator/instagram" element={<InstagramQrGenerator />} />
      <Route path="/gradient-generator" element={<GradientGenerator />} />
      <Route path="/video-to-mp3" element={<VideoToMp3 />} />
      <Route path="/pdf-to-word" element={<PdfToWord />} />
      <Route path="/image-background-remover" element={<ImageBackgroundRemover />} />
      <Route path="/image-compressor" element={<ImageCompressor />} />
      <Route path="/code-formatter" element={<CodeFormatter />} />
      <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
      <Route path="/unit-converter" element={<UnitConverter />} />
    </Routes>
  );
};

export default AppRoutes;
