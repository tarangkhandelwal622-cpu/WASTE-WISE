const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

const groqFallback = async (messages, maxTokens, temperature) => {
  try {
    const { chat: groqChat } = require('./groqService');
    return await groqChat(messages, maxTokens, temperature);
  } catch (error) {
    console.error('Groq fallback error:', error.message);
    return null; // Return null instead of recursing infinitely
  }
};

const chat = async (messages, maxTokens = 4096, temperature = 0.4, model = null) => {
  if (!OPENROUTER_API_KEY) {
    console.warn('OPENROUTER_API_KEY not set — returning null');
    return null;
  }

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: model || OPENROUTER_MODEL,
        messages,
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://wastewise.app',
          'X-Title': 'WasteWise',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return response.data.choices?.[0]?.message?.content;
  } catch (error) {
    const status = error.response?.status;
    const providerMessage = error.response?.data?.error?.message || error.message;
    console.error(`OpenRouter API error${status ? ` ${status}` : ''}: ${providerMessage}`);
    return groqFallback(messages, maxTokens, temperature);
  }
};

const decomposeComponents = async (productName, description) => {
  const prompt = `You are analysing ${productName} which is ${description}.
This item has expired/is waste. Decompose it into ALL its physical components.
Think carefully — a rotten apple has: flesh, peel, seeds, core.
An expired milk carton has: cardboard body, plastic lining, foil layer, cap.
A broken phone has: screen, battery, camera module, speakers, frame, cables.
Return a JSON array of components:
[{
  "component_name": "name",
  "component_type": "food/packaging/electronic/organic/chemical",
  "material": "specific material",
  "condition": "good/fair/degraded/contaminated",
  "estimated_percentage": "percentage of whole item this component represents"
}]
Be thorough. Nothing should be left unaccounted for. Think at least 3 layers deep.
A rotten apple seed is not waste — it can grow a plant. Find every highest use.
Return ONLY the JSON array.`;

  const result = await chat([{ role: 'user', content: prompt }], 2048);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Component decomposition parsing error:', e.message);
    return null;
  }
};

const safetyAssessment = async (component, productInfo, daysPastExpiry, expiryType, riskIndicators, userMedical, weather) => {
  const prompt = `Component: ${component.component_name} from ${productInfo.productName}
Days past expiry: ${daysPastExpiry}
Expiry type: ${expiryType}
Risk indicators found: ${(riskIndicators || []).join(', ')}
User medical profile: ${userMedical?.conditions || 'none'}, medications: ${userMedical?.medications || 'none'}, allergies: ${userMedical?.allergies || 'none'}, pregnant: ${userMedical?.is_pregnant || false}, age group: ${userMedical?.age_group || 'unknown'}
User skin type: ${userMedical?.skin_type || 'unknown'}
Current weather: ${weather.temp}°C, ${weather.humidity}% humidity
Season: ${weather.season}

Assess safety for repurposing. Return JSON:
{
  "is_safe": true or false,
  "safety_level": "safe/caution/unsafe",
  "reason": "specific reason",
  "safe_for_body": true or false,
  "safe_for_animals": true or false,
  "safe_for_plants": true or false,
  "safe_for_crafts": true or false,
  "warnings": ["specific warning 1", "specific warning 2"],
  "must_not": ["absolute prohibition 1 for this user specifically"]
}

Hard rules you must always enforce:
- If mould is visible on food: safe_for_body = false, safe_for_animals = check species
- If days past expiry > 180 for dairy: safe_for_body = false
- If user is pregnant: be extra conservative on all topical applications
- If user is allergic to any ingredient present: safe_for_body = false
- Potato peel / tomato peel: safe_for_animals = false for dogs, cats
- Onion / garlic: safe_for_animals = false for dogs, cats always
- Avocado any part: safe_for_animals = false for all species — HARD BLOCK
- Precious metal extraction from electronics: never suggest — HARD BLOCK

Return ONLY the JSON object.`;

  const result = await chat([{ role: 'user', content: prompt }], 1024);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Safety assessment parsing error:', e.message);
    return null;
  }
};

const generateDisclaimer = async (title, moduleType, userProfile) => {
  const prompt = `Suggestion: ${title}
Module type: ${moduleType}
User profile: ${JSON.stringify(userProfile)}

Generate a specific, personalised disclaimer. Include:
- Who specifically should not use this (based on this user's profile)
- What to watch for and when to stop
- Whether a patch test is required
- The medical/veterinary boundary statement
- Safe quantity ceiling if relevant

Be specific to this user — not generic warnings.
If this user is pregnant, say so specifically.
If this user has a nut allergy and the step involves coconut, flag it.

Return JSON:
{
  "who_should_not_use": "text",
  "when_to_stop": "text",
  "patch_test_required": true or false,
  "medical_boundary": "text",
  "animal_safety_note": "text or null",
  "quantity_ceiling": "text or null"
}

Return ONLY the JSON object.`;

  const result = await chat([{ role: 'user', content: prompt }], 512);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Disclaimer generation parsing error:', e.message);
    return null;
  }
};

module.exports = { chat, decomposeComponents, safetyAssessment, generateDisclaimer };
