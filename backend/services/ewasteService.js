const axios = require('axios');

const assessEwaste = async (deviceInfo, location, openrouterChat) => {
  const prompt = `Device: ${deviceInfo.device_category}, brand: ${deviceInfo.brand || 'unknown'}, age: ${deviceInfo.age || 'unknown'}, condition: ${deviceInfo.condition || 'unknown'}
Specific issue: ${deviceInfo.issue || 'none'}
User location: ${location.city || 'unknown'}, ${location.state || 'unknown'}

Assess this electronic device and determine all possible pathways.
Return JSON:
{
  "can_repair": true or false,
  "repair_difficulty": "Easy/Medium/Hard/Professional only",
  "common_fix": "most likely fix for the stated issue",
  "ifixit_search_term": "search term to find iFixit guide",
  "can_sell": true or false,
  "estimated_resale_value": "range in rupees",
  "recommended_platforms": ["Cashify", "OLX"],
  "can_donate": true or false,
  "donation_suitable_for": "schools/offices/individuals",
  "components_to_salvage": [
    {"component": "speakers", "condition": "likely good", "reuse": "use with amplifier board"}
  ],
  "recycling_required_for": ["battery", "screen", "circuit board"],
  "contains_hazardous": true or false,
  "hazardous_materials": ["lithium battery", "mercury in screen"]
}

Return ONLY the JSON object.`;

  try {
    const result = await openrouterChat([{ role: 'user', content: prompt }], 2048);
    if (!result) return null;

    const cleaned = result.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('E-waste assessment error:', error.message);
    return null;
  }
};

const getRecyclingPlatforms = async (pool, type = 'recycling') => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM electronics_platforms WHERE type = ? ORDER BY is_doorstep_pickup DESC',
      [type]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching recycling platforms:', error.message);
    return [];
  }
};

const getResalePlatforms = async (pool) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM electronics_platforms WHERE type = "resale" ORDER BY pays_user DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error fetching resale platforms:', error.message);
    return [];
  }
};

const getDonationPlatforms = async (pool) => {
  try {
    const [rows] = await pool.query('SELECT * FROM electronics_platforms WHERE type = "donation"');
    return rows;
  } catch (error) {
    console.error('Error fetching donation platforms:', error.message);
    return [];
  }
};

module.exports = { assessEwaste, getRecyclingPlatforms, getResalePlatforms, getDonationPlatforms };
