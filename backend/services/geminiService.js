const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_WEB_SEARCH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const analyzeProductImage = async (imageBase64, mimeType) => {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set — returning manual fallback');
    return null;
  }

  const prompt = `You are an expert computer vision model. Analyse this product image in high detail and extract the following information. Be as precise as possible. Read all visible text.
Return a JSON object strictly matching this schema:
{
  "product_name": "Exact name of the product or item",
  "brand": "Brand name if visible, else null",
  "category": "Choose the best fit: dairy/oils/grains/fruits_veg/spices/cosmetics/beverages/packaged_food/household/electronics/packaging/peels/unknown",
  "ingredients": ["list", "of", "ingredients", "exactly", "as", "written", "on", "label"],
  "expiry_date": "Identify any dates. Return the expiry date in YYYY-MM-DD format, or null if not found.",
  "expiry_type": "Classify the date as: best_before, use_by, expiry_date, or unknown",
  "quantity": "Extract net weight, volume, or count (e.g. '500g', '1L', '2 pieces')",
  "risk_indicators": ["List any visible mould", "discolouration", "damage", "spoilage", "rust"],
  "packaging_material": "Identify main material: glass/plastic/cardboard/metal/fabric/mixed"
}

Return ONLY the JSON object. No markdown, no explanation. Ensure it is valid JSON.`;

  try {
    const response = await axios.post(
      `${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: { response_mime_type: 'application/json' },
      },
      { timeout: 30000 }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No text returned from Gemini');

    const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    const status = error.response?.status;
    console.error(`Gemini Vision analysis error${status ? ` (Status ${status})` : ''}:`, error.message);
    
    console.log('[GeminiService] Falling back to Groq Vision API...');
    try {
      const { analyzeProductImageFallback } = require('./groqService');
      const fallbackResult = await analyzeProductImageFallback(imageBase64, mimeType, prompt);
      if (fallbackResult) {
        console.log('[GeminiService] Groq Vision fallback succeeded');
        return fallbackResult;
      }
      throw new Error('Groq fallback returned null');
    } catch (fallbackError) {
      console.error('[GeminiService] Groq Vision fallback failed:', fallbackError.message);
      throw new Error('Image analysis failed on both Gemini and Groq. Please check your API limits or try a clearer image.');
    }
  }
};

const webSearch = async (query, maxResults = 5) => {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set — returning empty results');
    return [];
  }

  try {
    const response = await axios.post(
      `${GEMINI_WEB_SEARCH_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: `Search and summarize: ${query}. Return results with source URLs.` }] }],
        tools: [{ google_search: {} }],
      },
      { timeout: 30000 }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const groundingMetadata = response.data.candidates?.[0]?.groundingMetadata;

    return { text, groundingMetadata };
  } catch (error) {
    const status = error.response?.status;
    const providerMessage = error.response?.data?.error?.message || error.message;
    console.error(`Gemini web search error${status ? ` ${status}` : ''}: ${providerMessage}`);

    try {
      const { search } = require('./tavilyService');
      const results = await search(query, { search_depth: 'basic', max_results: maxResults });
      return {
        text: results.map((result) => `${result.title}: ${result.content || result.url}`).join('\n'),
        groundingMetadata: { source: 'tavily', results },
      };
    } catch (fallbackError) {
      console.error('Tavily fallback search error:', fallbackError.message);
      return { text: '', groundingMetadata: null };
    }
  }
};

const extractYouTubeUrl = async (query) => {
  try {
    const result = await webSearch(`${query} tutorial site:youtube.com`);
    const text = result.text || '';
    const ytMatch = text.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/);
    if (ytMatch) return ytMatch[0];

    const shortMatch = text.match(/https?:\/\/youtu\.be\/[\w-]+/);
    return shortMatch ? shortMatch[0] : null;
  } catch (error) {
    console.error('YouTube URL extraction error:', error.message);
    return null;
  }
};

module.exports = { analyzeProductImage, webSearch, extractYouTubeUrl };
