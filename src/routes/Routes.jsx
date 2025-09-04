import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tools from '../pages/Tools';
import About from '../pages/About';
import TermsAndConditions from '../pages/TermsAndConditions';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import QrGenerator from '../pages/tools/QrGenerator';
import UrlQrGenerator from '../components/qr-types/UrlQrGenerator';
import WhatsAppQrGenerator from '../components/qr-types/WhatsAppQrGenerator';
import EmailQrGenerator from '../components/qr-types/EmailQrGenerator';
import YoutubeQrGenerator from '../components/qr-types/YoutubeQrGenerator';
import LocationQrGenerator from '../components/qr-types/LocationQrGenerator';
import TextQrGenerator from '../components/qr-types/TextQrGenerator';
import InstagramQrGenerator from '../components/qr-types/InstagramQrGenerator';
import GradientGenerator from '../pages/tools/GradientGenerator';
import VideoToMp3 from '../pages/tools/VideoToMp3';
import PdfToWord from '../pages/tools/PdfToWord';
import ImageBackgroundRemover from '../pages/tools/ImageBackgroundRemover';
import ImageCompressor from '../pages/tools/ImageCompressor';
import CodeFormatter from '../pages/tools/CodeFormatter';
import ColorPaletteGenerator from '../pages/tools/ColorPaletteGenerator';
import UnitConverter from '../pages/tools/UnitConverter';
import HashGenerator from '../pages/tools/HashGenerator';
import Base64Converter from '../pages/tools/Base64Converter';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
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
      <Route path="/tools/unit-converter" element={<UnitConverter />} />
      <Route path="/tools/hash-generator" element={<HashGenerator />} />
      <Route path="/tools/base64-converter" element={<Base64Converter />} />
    </Routes>
  );
};

export default AppRoutes;
