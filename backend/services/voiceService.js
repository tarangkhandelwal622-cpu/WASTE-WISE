const axios = require('axios');
const path = require('path');
const fs = require('fs');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

const voiceMap = {
  hi: { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  en: { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  ta: { voiceId: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  bn: { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  mr: { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  te: { voiceId: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  kn: { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  gu: { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
};

const getVoiceConfig = (language) => {
  return voiceMap[language] || voiceMap['en'];
};

const createSilentWavBase64 = (durationSeconds = 1) => {
  const sampleRate = 8000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer.toString('base64');
};

const generateSpeech = async (text, language = 'en') => {
  const voiceConfig = getVoiceConfig(language);

  if (!ELEVENLABS_API_KEY) {
    console.warn('ELEVENLABS_API_KEY not set — returning fallback audio');
    return { audio: createSilentWavBase64(1), voiceName: voiceConfig.name, language, fallback: true };
  }

  try {
    const response = await axios.post(
      `${ELEVENLABS_URL}/${voiceConfig.voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');
    return { audio: audioBase64, voiceName: voiceConfig.name, language };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error.message);
    return { audio: createSilentWavBase64(1), voiceName: voiceConfig.name, language, fallback: true };
  }
};

const formatSuggestionForVoice = (suggestion, disclaimer) => {
  const steps = Array.isArray(suggestion.steps)
    ? suggestion.steps.map((s, i) => `Step ${i + 1}: ${typeof s === 'string' ? s : s.instruction || s.title}`).join('. ')
    : suggestion.steps;

  let text = `${suggestion.title}. `;
  if (steps) text += `${steps}. `;
  if (disclaimer) text += `Safety note: ${disclaimer}. `;

  return text;
};

module.exports = { generateSpeech, formatSuggestionForVoice, getVoiceConfig };
