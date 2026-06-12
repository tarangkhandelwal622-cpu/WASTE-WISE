const { generateAllSuggestions } = require('../services/suggestionModules');
const { assessEwaste, getRecyclingPlatforms, getResalePlatforms, getDonationPlatforms } = require('../services/ewasteService');
const { getSeason } = require('../utils/seasonHelper');
const { getWeather } = require('../utils/weather');
const pool = require('../config/db');

const generateSuggestions = async (req, res) => {
  try {
    const { scan_id, selected_goals, contextual_answers } = req.body;
    const userId = req.user.id;

    const goals = selected_goals || ['all'];

    const [scanRows] = await pool.query(
      'SELECT * FROM scans WHERE id = ? AND user_id = ?',
      [scan_id, userId]
    );
    if (scanRows.length === 0) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    const scan = scanRows[0];
    const weather = {
      temp: scan.weather_temp,
      humidity: scan.weather_humidity,
      uv: scan.weather_uv,
      season: scan.season || getSeason(new Date().getMonth() + 1),
    };

    const [items] = await pool.query('SELECT * FROM items WHERE scan_id = ?', [scan_id]);
    const components = [];

    for (const item of items) {
      const [compRows] = await pool.query(
        'SELECT * FROM item_components WHERE item_id = ? AND is_safe_to_repurpose = TRUE',
        [item.id]
      );
      components.push(...compRows.map((c) => ({ ...c, item_name: item.product_name })));
    }

    const [userRows] = await pool.query(
      `SELECT u.*, up.culture, up.state, up.city, up.is_rural, up.lat, up.lng, up.language,
              um.conditions, um.medications, um.allergies, um.is_pregnant, um.age_group,
              us.skin_type
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN user_medical um ON u.id = um.user_id
       LEFT JOIN user_skin us ON u.id = us.user_id
       WHERE u.id = ?`,
      [userId]
    );
    const userProfile = userRows[0] || {};

    const analysisResult = {
      scanId: scan_id,
      components,
      safetyResults: components.map((c) => ({ component_id: c.id, is_safe: true })),
      weather,
      userProfile,
      productName: items[0]?.product_name || 'Item',
    };

    const result = await generateAllSuggestions(analysisResult, goals, contextual_answers || {}, pool);

    res.json(result);
  } catch (error) {
    console.error('Generate suggestions error:', error.message);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};

const getEwasteAssessment = async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    const [scanRows] = await pool.query(
      'SELECT * FROM scans WHERE id = ? AND user_id = ?',
      [scanId, userId]
    );
    if (scanRows.length === 0) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    const [items] = await pool.query('SELECT * FROM items WHERE scan_id = ?', [scanId]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'No items found for this scan' });
    }

    const item = items[0];
    const deviceInfo = JSON.parse(item.raw_input || '{}');

    const [profileRows] = await pool.query(
      'SELECT city, state, lat, lng FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    const location = profileRows[0] || {};

    const { chat: openrouterChat } = require('../services/openrouterService');
    const assessment = await assessEwaste(deviceInfo, location, openrouterChat);

    const [recyclingPlatforms] = await Promise.all([
      getRecyclingPlatforms(pool),
    ]);

    const [resalePlatforms] = await Promise.all([
      getResalePlatforms(pool),
    ]);

    const [donationPlatforms] = await Promise.all([
      getDonationPlatforms(pool),
    ]);

    res.json({
      assessment,
      recyclingPlatforms,
      resalePlatforms,
      donationPlatforms,
    });
  } catch (error) {
    console.error('E-waste assessment error:', error.message);
    res.status(500).json({ error: 'Failed to assess e-waste' });
  }
};

const getDisposalOptions = async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    const [profileRows] = await pool.query(
      'SELECT lat, lng, city FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    const profile = profileRows[0] || {};

    const disposalOptions = [
      {
        type: 'compost',
        title: 'Compost',
        description: 'If organic, compost in your garden or community compost bin.',
        has_garden: profile.is_rural === 1,
      },
      {
        type: 'kabadiwala',
        title: 'Nearest kabadiwala',
        description: 'Sell recyclables to your local scrap dealer.',
      },
      {
        type: 'hazardous',
        title: 'Hazardous waste collection',
        description: 'For degraded cosmetics and chemicals — follow CPCB guidelines.',
      },
      {
        type: 'waste_bin',
        title: 'Regular waste bin',
        description: 'Last resort — wrap properly before disposing.',
      },
    ];

    res.json({ disposalOptions, location: profile });
  } catch (error) {
    console.error('Get disposal options error:', error.message);
    res.status(500).json({ error: 'Failed to fetch disposal options' });
  }
};

module.exports = { generateSuggestions, getEwasteAssessment, getDisposalOptions };
