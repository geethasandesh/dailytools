export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang = 'en-us', voice = '', rate = '0' } = req.body;
  const apiKey = process.env.VOICERSS_API_KEY; // Set this in Vercel env vars

  if (!text || !apiKey) {
    return res.status(400).json({ error: 'Missing text or API key' });
  }

  const params = new URLSearchParams({
    key: apiKey,
    src: text,
    hl: lang,
    v: voice,
    r: rate,
    c: 'MP3',
    f: '44khz_16bit_stereo'
  });

  const url = `https://api.voicerss.org/?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    return res.status(500).json({ error: 'VoiceRSS API error' });
  }

  const arrayBuffer = await response.arrayBuffer();
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'attachment; filename="tts.mp3"');
  res.status(200).send(Buffer.from(arrayBuffer));
} 