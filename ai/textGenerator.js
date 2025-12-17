const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const anthropic = process.env.AI_PROVIDER === 'anthropic' 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.AI_PROVIDER === 'openai'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Generate listing description
async function generateListingDescription(listingData) {
  const { title, location, country, price, amenities = [] } = listingData;

  const prompt = `Create an engaging, SEO-optimized property listing description for a travel accommodation booking platform.

Property Details:
- Title: ${title}
- Location: ${location}, ${country}
- Price: $${price} per night
- Amenities: ${amenities.join(', ') || 'Standard amenities'}

Requirements:
1. Write 3-4 compelling paragraphs (150-200 words total)
2. Highlight unique features and location benefits
3. Use descriptive, evocative language
4. Include call-to-action
5. SEO-friendly but natural
6. Professional yet warm tone

Do not include markdown formatting or titles.`;

  try {
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text.trim();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.8
      });
      return response.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Text generation error:', error);
    throw new Error('Failed to generate description');
  }
}

// Enhance existing description
async function enhanceDescription(currentDescription) {
  const prompt = `Improve this property listing description to be more engaging and professional:

Current Description:
${currentDescription}

Make it:
1. More vivid and descriptive
2. Better structured
3. More persuasive
4. SEO-optimized
5. Around 150-200 words

Provide only the improved description without any preamble.`;

  try {
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text.trim();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.8
      });
      return response.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Description enhancement error:', error);
    throw new Error('Failed to enhance description');
  }
}

// Generate title suggestions
async function generateTitleSuggestions(location, propertyType = 'accommodation') {
  const prompt = `Generate 5 creative, catchy titles for a ${propertyType} listing in ${location}.
  
Each title should be:
- 5-8 words long
- Descriptive and appealing
- Include a unique selling point
- Professional yet inviting

Format: Return only the 5 titles, one per line, without numbering.`;

  try {
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text.trim().split('\n').filter(line => line.trim());
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.9
      });
      return response.choices[0].message.content.trim().split('\n').filter(line => line.trim());
    }
  } catch (error) {
    console.error('Title generation error:', error);
    throw new Error('Failed to generate titles');
  }
}

// Translate description
async function translateDescription(text, targetLanguage) {
  const prompt = `Translate the following accommodation description to ${targetLanguage}. 
Maintain the tone, style, and marketing appeal:

${text}

Provide only the translation.`;

  try {
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text.trim();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      });
      return response.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate description');
  }
}

module.exports = {
  generateListingDescription,
  enhanceDescription,
  generateTitleSuggestions,
  translateDescription
};