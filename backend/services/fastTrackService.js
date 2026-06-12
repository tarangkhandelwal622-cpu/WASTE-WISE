// Fast-track service for immediate analysis when AI APIs are slow/unavailable
const path = require('path');

const FAST_TRACK_TIMEOUT = 8000; // 8 seconds max for entire pipeline

const fastDecompose = (productName, category) => {
  // Quick heuristic-based decomposition
  const lower = (productName || '').toLowerCase();
  
  if (category === 'food_peels' || lower.includes('peel') || lower.includes('banana') || lower.includes('apple') || lower.includes('potato')) {
    return [{
      component_name: productName || 'Organic matter',
      component_type: 'organic',
      material: productName || 'organic',
      condition: 'good',
      estimated_percentage: 100
    }];
  }
  
  if (category === 'waste_packaging' || lower.includes('plastic') || lower.includes('bottle') || lower.includes('container')) {
    return [{
      component_name: productName || 'Packaging material',
      component_type: 'packaging',
      material: 'plastic',
      condition: 'good',
      estimated_percentage: 100
    }];
  }
  
  if (category === 'electronics' || lower.includes('phone') || lower.includes('laptop') || lower.includes('device')) {
    return [
      { component_name: 'Device body', component_type: 'electronic', material: 'plastic/metal', condition: 'fair', estimated_percentage: 50 },
      { component_name: 'Circuit board', component_type: 'electronic', material: 'PCB', condition: 'fair', estimated_percentage: 20 },
      { component_name: 'Battery', component_type: 'electronic', material: 'lithium', condition: 'fair', estimated_percentage: 15 },
      { component_name: 'Screen', component_type: 'electronic', material: 'glass/LCD', condition: 'fair', estimated_percentage: 15 }
    ];
  }
  
  // Default for expired products
  return [{
    component_name: productName || 'Item',
    component_type: category || 'expired_product',
    material: productName || 'mixed',
    condition: 'degraded',
    estimated_percentage: 100
  }];
};

const fastSafetyCheck = (component, productInfo) => {
  const lower = (component.component_name || '').toLowerCase();
  
  // Hard blocks
  if (lower.includes('avocado') || lower.includes('onion') || lower.includes('garlic')) {
    return {
      is_safe: true,
      safety_level: 'caution',
      safe_for_body: true,
      safe_for_animals: false,
      safe_for_plants: true,
      safe_for_crafts: true,
      warnings: ['Not safe for pets (dogs/cats)'],
      must_not: ['Do not feed to dogs or cats']
    };
  }
  
  if (lower.includes('mould') || lower.includes('rotten')) {
    return {
      is_safe: false,
      safety_level: 'unsafe',
      safe_for_body: false,
      safe_for_animals: false,
      safe_for_plants: true,
      safe_for_crafts: false,
      warnings: ['Visible mould/rot detected'],
      must_not: ['Do not use on skin or consume']
    };
  }
  
  return {
    is_safe: true,
    safety_level: 'safe',
    safe_for_body: true,
    safe_for_animals: true,
    safe_for_plants: true,
    safe_for_crafts: true,
    warnings: [],
    must_not: []
  };
};

const fastSuggestionGenerator = (component, userProfile, weather) => {
  const lower = (component.component_name || '').toLowerCase();
  const suggestions = [];
  
  // Organic/food suggestions
  if (component.component_type === 'organic' || lower.includes('peel') || lower.includes('banana') || lower.includes('apple')) {
    suggestions.push({
      item_component_id: component.id,
      module_type: 'traditional',
      title: 'Compost for Garden',
      steps: [
        'Cut into small pieces for faster decomposition',
        'Add to your compost bin with brown materials (dry leaves, paper)',
        'Turn the compost every week for aeration',
        'Use finished compost in 2-3 months for nutrient-rich soil'
      ],
      source_url: null,
      source_credibility: 'Traditional',
      region_tag: userProfile.state || 'India',
      personalisation_note: 'Great for home gardening and reducing waste',
      video_url: null
    });
    
    suggestions.push({
      item_component_id: component.id,
      module_type: 'animal_feed',
      title: 'Feed to Cattle (if not onion/garlic)',
      steps: [
        'Ensure it\'s clean and free from plastic/stickers',
        'Cut into manageable pieces',
        'Mix with regular cattle feed',
        'Observe animals for any discomfort'
      ],
      source_url: null,
      source_credibility: 'Traditional',
      region_tag: userProfile.state || 'India',
      personalisation_note: 'Cattle can digest most organic waste safely',
      video_url: null
    });
  }
  
  // Packaging suggestions
  if (component.component_type === 'packaging' || lower.includes('plastic') || lower.includes('bottle')) {
    suggestions.push({
      item_component_id: component.id,
      module_type: 'diy',
      title: 'Repurpose as Storage Container',
      steps: [
        'Clean thoroughly with soap and water',
        'Remove any labels and adhesive residue',
        'Let dry completely',
        'Use for storing grains, spices, or small items'
      ],
      source_url: null,
      source_credibility: 'Community',
      region_tag: null,
      personalisation_note: 'Reduces need to buy new storage containers',
      video_url: null
    });
    
    suggestions.push({
      item_component_id: component.id,
      module_type: 'modern',
      title: 'Recycle Through Proper Channels',
      steps: [
        'Check recycling symbol on the packaging',
        'Rinse and dry completely',
        'Flatten to save space',
        'Drop off at local recycling center or give to kabadiwala'
      ],
      source_url: null,
      source_credibility: 'Community',
      region_tag: null,
      personalisation_note: 'Ensures material gets properly recycled',
      video_url: null
    });
  }
  
  // Electronics suggestions
  if (component.component_type === 'electronic') {
    suggestions.push({
      item_component_id: component.id,
      module_type: 'modern',
      title: 'E-waste Recycling',
      steps: [
        'Do not throw in regular trash',
        'Remove battery if accessible (recycle separately)',
        'Take to authorized e-waste recycler',
        'Get receipt for proper disposal tracking'
      ],
      source_url: null,
      source_credibility: 'Research',
      region_tag: null,
      personalisation_note: 'Prevents toxic materials from entering landfills',
      video_url: null
    });
  }
  
  // Default fallback suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      item_component_id: component.id,
      module_type: 'diy',
      title: `Repurpose ${component.component_name}`,
      steps: [
        `Clean ${component.component_name} thoroughly`,
        'Assess its current condition and material',
        'Find creative reuse based on its properties',
        'Share your idea with the community'
      ],
      source_url: null,
      source_credibility: 'Community',
      region_tag: userProfile.state || null,
      personalisation_note: 'Every item has potential for a second life',
      video_url: null
    });
  }
  
  return suggestions;
};

const fastDisclaimerGenerator = (suggestionTitle, moduleType, userProfile) => {
  const disclaimers = [];
  
  if (moduleType === 'animal_feed') {
    disclaimers.push({
      who_should_not_use: 'Pet owners (dogs, cats) for certain materials',
      when_to_stop: 'If animals show signs of digestive discomfort',
      patch_test_required: false,
      medical_boundary: 'Not a substitute for veterinary advice',
      animal_safety_note: 'Always research specific safety for your animal species',
      quantity_ceiling: 'Start with small amounts and observe'
    });
  } else if (moduleType === 'traditional' || moduleType === 'health') {
    disclaimers.push({
      who_should_not_use: userProfile.is_pregnant ? 'Pregnant women should consult doctor first' : 'People with known allergies',
      when_to_stop: 'If any irritation, redness, or discomfort occurs',
      patch_test_required: true,
      medical_boundary: 'This is traditional knowledge, not medical advice',
      animal_safety_note: null,
      quantity_ceiling: 'Use sparingly for topical applications'
    });
  } else {
    disclaimers.push({
      who_should_not_use: 'Anyone with sensitivity to the material',
      when_to_stop: 'If any adverse reaction occurs',
      patch_test_required: false,
      medical_boundary: 'General reuse suggestions, not professional advice',
      animal_safety_note: 'Keep away from pets if uncertain',
      quantity_ceiling: 'Household quantities only'
    });
  }
  
  return disclaimers[0];
};

module.exports = {
  fastDecompose,
  fastSafetyCheck,
  fastSuggestionGenerator,
  fastDisclaimerGenerator,
  FAST_TRACK_TIMEOUT
};