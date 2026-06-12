const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const chat = async (messages, maxTokens = 2048, temperature = 0.3) => {
  if (!GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not set — returning null');
    return null;
  }

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages,
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    const status = error.response?.status;
    const providerMessage = error.response?.data?.error?.message || error.message;
    console.error(`Groq API error${status ? ` ${status}` : ''}: ${providerMessage}`);
    return null;
  }
};

const animalFeedAnalysis = async (component, species, animalWeight, season, temp, chromaResults) => {
  const prompt = `Knowledge base information about feeding ${component.component_name} to ${species}:
${chromaResults || 'No specific knowledge base documents found.'}

Component details: ${component.component_name}, condition: ${component.condition_status || 'unknown'}, quantity: ${component.estimated_quantity || 'unknown'} ${component.unit || ''}
Animal: ${species}, estimated weight: ${animalWeight}kg
Current season: ${season}, temperature: ${temp}°C

Calculate safe feeding recommendation. Apply these hard rules:
- Potato peel: NEVER for dogs or cats (solanine toxicity)
- Onion/garlic: NEVER for dogs or cats (haemolytic anaemia)
- Avocado: NEVER for any animal — HARD BLOCK, return error
- Citrus in large amounts: avoid for most animals

Return JSON:
{
  "is_safe_to_feed": true or false,
  "safe_species": ["cow", "goat"],
  "unsafe_species": ["dog", "cat"],
  "reason_for_unsafe": "specific toxicity reason",
  "safe_quantity_per_kg_bodyweight": "amount in grams",
  "total_safe_amount": "calculated for stated animal weight",
  "frequency": "how often to feed",
  "preparation": "how to prepare before feeding",
  "seasonal_note": "any adjustment for current weather/season",
  "source": "source document from knowledge base"
}

Return ONLY the JSON object.`;

  const result = await chat([{ role: 'user', content: prompt }], 1024);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Groq animal feed parsing error:', e.message);
    return null;
  }
};

module.exports = { chat, animalFeedAnalysis };
