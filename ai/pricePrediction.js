const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const anthropic = process.env.AI_PROVIDER === 'anthropic' 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.AI_PROVIDER === 'openai'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Predict optimal price for a listing
async function predictOptimalPrice(listingData) {
  const { location, country, propertyType, bedrooms, amenities = [], currentPrice } = listingData;

  const prompt = `As a real estate pricing expert, analyze this accommodation and suggest an optimal nightly price.

Property Details:
- Location: ${location}, ${country}
- Type: ${propertyType || 'Standard accommodation'}
- Bedrooms: ${bedrooms || 'Not specified'}
- Amenities: ${amenities.join(', ') || 'Standard amenities'}
- Current Price: $${currentPrice || 'Not set'}

Consider:
1. Location desirability and market rates
2. Property type and size
3. Amenities offered
4. Seasonal variations
5. Competitive positioning

Provide response in this JSON format:
{
  "suggested_price": number,
  "price_range": {"min": number, "max": number},
  "confidence": "high/medium/low",
  "reasoning": "explanation",
  "seasonal_adjustments": {
    "peak_season": {"months": [], "multiplier": number},
    "off_season": {"months": [], "multiplier": number}
  },
  "competitive_analysis": "market positioning",
  "recommendations": ["tip1", "tip2", ...]
}

Return ONLY valid JSON.`;

  try {
    let responseText;
    
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      });
      responseText = response.content[0].text;
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.5
      });
      responseText = response.choices[0].message.content;
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Price prediction error:', error);
    
    // Fallback basic calculation
    const basePrice = currentPrice || 100;
    return {
      suggested_price: basePrice,
      price_range: { min: basePrice * 0.8, max: basePrice * 1.2 },
      confidence: 'low',
      reasoning: 'Using basic estimation due to API error',
      seasonal_adjustments: {
        peak_season: { months: ['Jun', 'Jul', 'Aug'], multiplier: 1.3 },
        off_season: { months: ['Jan', 'Feb', 'Nov'], multiplier: 0.8 }
      },
      competitive_analysis: 'Unable to perform detailed analysis',
      recommendations: ['Set competitive pricing', 'Monitor market trends']
    };
  }
}

// Analyze pricing trends for a location
async function analyzePricingTrends(location, country) {
  const prompt = `Analyze accommodation pricing trends for ${location}, ${country}.

Provide insights on:
1. Average nightly rates by property type
2. Seasonal price variations
3. Popular amenities that command premium pricing
4. Market growth trends
5. Competitive landscape

Format as JSON:
{
  "average_prices": {
    "budget": number,
    "mid_range": number,
    "luxury": number
  },
  "seasonal_trends": "description",
  "premium_amenities": ["amenity1", "amenity2", ...],
  "market_outlook": "description",
  "key_insights": ["insight1", "insight2", ...]
}`;

  try {
    let responseText;
    
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      });
      responseText = response.content[0].text;
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.5
      });
      responseText = response.choices[0].message.content;
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Trend analysis error:', error);
    return null;
  }
}

// Get dynamic pricing recommendations
async function getDynamicPricingRecommendations(listingData, bookingData = {}) {
  const { occupancyRate = 0, upcomingBookings = 0, seasonalDemand = 'medium' } = bookingData;

  const prompt = `Provide dynamic pricing recommendations for this listing:

Current Situation:
- Base Price: $${listingData.currentPrice}
- Occupancy Rate: ${occupancyRate}%
- Upcoming Bookings: ${upcomingBookings}
- Seasonal Demand: ${seasonalDemand}
- Location: ${listingData.location}

Recommend:
1. Should price be adjusted? (increase/decrease/maintain)
2. By how much? (percentage or amount)
3. For what period?
4. Why?

Respond in JSON:
{
  "action": "increase/decrease/maintain",
  "adjustment": number (percentage),
  "recommended_price": number,
  "duration": "description",
  "reasoning": "explanation",
  "urgency": "high/medium/low"
}`;

  try {
    let responseText;
    
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      });
      responseText = response.content[0].text;
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.5
      });
      responseText = response.choices[0].message.content;
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Dynamic pricing error:', error);
    return {
      action: 'maintain',
      adjustment: 0,
      recommended_price: listingData.currentPrice,
      duration: 'Current period',
      reasoning: 'Insufficient data for recommendation',
      urgency: 'low'
    };
  }
}

module.exports = {
  predictOptimalPrice,
  analyzePricingTrends,
  getDynamicPricingRecommendations
};