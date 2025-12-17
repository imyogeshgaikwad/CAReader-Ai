const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

// Initialize AI clients
const anthropic = process.env.AI_PROVIDER === 'anthropic' 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.AI_PROVIDER === 'openai'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// System prompt for the travel assistant
const SYSTEM_PROMPT = `You are a helpful travel assistant for Wanderlust, a premium accommodation booking platform. 
Your role is to:
- Help users find perfect accommodations
- Provide travel tips and recommendations
- Answer questions about destinations
- Suggest itineraries and activities
- Give cultural insights and local tips

Be friendly, informative, and concise. Always prioritize user safety and authentic travel experiences.`;

// Chat with AI using Anthropic Claude
async function chatWithClaude(userMessage, conversationHistory = []) {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    return {
      message: response.content[0].text,
      conversationHistory: [
        ...messages,
        { role: 'assistant', content: response.content[0].text }
      ]
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

// Chat with AI using OpenAI
async function chatWithOpenAI(userMessage, conversationHistory = []) {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7
    });

    const assistantMessage = response.choices[0].message.content;

    return {
      message: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage }
      ]
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

// Main chat function that routes to appropriate AI provider
async function chat(userMessage, conversationHistory = []) {
  if (process.env.AI_PROVIDER === 'anthropic') {
    return await chatWithClaude(userMessage, conversationHistory);
  } else if (process.env.AI_PROVIDER === 'openai') {
    return await chatWithOpenAI(userMessage, conversationHistory);
  } else {
    throw new Error('Invalid AI provider specified');
  }
}

// Generate travel itinerary
async function generateItinerary(destination, days, interests) {
  const prompt = `Create a ${days}-day travel itinerary for ${destination}. 
  Traveler interests: ${interests.join(', ')}
  
  Please provide:
  1. Daily activities and attractions
  2. Recommended restaurants
  3. Transportation tips
  4. Budget estimates
  5. Local cultural insights
  
  Format the itinerary in a clear, day-by-day structure.`;

  const response = await chat(prompt);
  return response.message;
}

// Get destination recommendations
async function getDestinationRecommendations(preferences) {
  const prompt = `Based on these travel preferences, recommend 5 destinations:
  - Budget: ${preferences.budget}
  - Travel style: ${preferences.travelStyle}
  - Interests: ${preferences.interests.join(', ')}
  - Season: ${preferences.season}
  
  For each destination, provide:
  1. Why it's a good match
  2. Best time to visit
  3. Estimated budget
  4. Top 3 things to do`;

  const response = await chat(prompt);
  return response.message;
}

module.exports = {
  chat,
  generateItinerary,
  getDestinationRecommendations
};