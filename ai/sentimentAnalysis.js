const Sentiment = require('sentiment');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

const sentiment = new Sentiment();

const anthropic = process.env.AI_PROVIDER === 'anthropic' 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.AI_PROVIDER === 'openai'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Basic sentiment analysis using sentiment library
function analyzeBasicSentiment(text) {
  const result = sentiment.analyze(text);
  
  let sentimentLabel = 'neutral';
  if (result.score > 2) sentimentLabel = 'very positive';
  else if (result.score > 0) sentimentLabel = 'positive';
  else if (result.score < -2) sentimentLabel = 'very negative';
  else if (result.score < 0) sentimentLabel = 'negative';

  return {
    score: result.score,
    comparative: result.comparative,
    sentiment: sentimentLabel,
    positive: result.positive,
    negative: result.negative
  };
}

// Advanced sentiment analysis with AI
async function analyzeAdvancedSentiment(text) {
  const prompt = `Analyze the sentiment of this review and provide detailed insights:

Review: "${text}"

Provide a JSON response with:
1. overall_sentiment: "positive", "negative", or "neutral"
2. confidence: 0-100
3. key_themes: array of main topics mentioned
4. strengths: array of positive aspects
5. weaknesses: array of negative aspects
6. emotion: primary emotion detected
7. summary: one-sentence summary

Return ONLY valid JSON, no markdown or explanation.`;

  try {
    let responseText;
    
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      });
      responseText = response.content[0].text;
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      });
      responseText = response.choices[0].message.content;
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Advanced sentiment analysis error:', error);
    // Fallback to basic sentiment
    return analyzeBasicSentiment(text);
  }
}

// Analyze multiple reviews and generate insights
async function analyzeReviewBatch(reviews) {
  const sentiments = reviews.map(review => analyzeBasicSentiment(review.comment));
  
  const totalScore = sentiments.reduce((sum, s) => sum + s.score, 0);
  const avgScore = totalScore / sentiments.length;
  
  const positive = sentiments.filter(s => s.score > 0).length;
  const negative = sentiments.filter(s => s.score < 0).length;
  const neutral = sentiments.length - positive - negative;

  return {
    total_reviews: reviews.length,
    average_score: avgScore.toFixed(2),
    distribution: {
      positive: positive,
      negative: negative,
      neutral: neutral
    },
    percentages: {
      positive: ((positive / reviews.length) * 100).toFixed(1),
      negative: ((negative / reviews.length) * 100).toFixed(1),
      neutral: ((neutral / reviews.length) * 100).toFixed(1)
    }
  };
}

// Generate summary from multiple reviews
async function generateReviewSummary(reviews) {
  if (reviews.length === 0) return 'No reviews available yet.';

  const reviewTexts = reviews.map(r => `- ${r.comment}`).join('\n');
  
  const prompt = `Summarize these customer reviews for a property listing. 
Focus on common themes, strengths, and areas for improvement:

${reviewTexts}

Provide a concise 2-3 paragraph summary that potential guests would find helpful.`;

  try {
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text.trim();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      });
      return response.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Summary generation error:', error);
    return 'Unable to generate summary at this time.';
  }
}

// Extract key topics from reviews
async function extractKeyTopics(reviews) {
  if (reviews.length === 0) return [];

  const reviewTexts = reviews.map(r => r.comment).join('\n\n');
  
  const prompt = `Extract the top 5-7 key topics mentioned in these reviews:

${reviewTexts}

Return ONLY a JSON array of topics, like: ["cleanliness", "location", "staff"]`;

  try {
    let responseText;
    
    if (process.env.AI_PROVIDER === 'anthropic') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      });
      responseText = response.content[0].text;
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3
      });
      responseText = response.choices[0].message.content;
    }

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Topic extraction error:', error);
    return [];
  }
}

module.exports = {
  analyzeBasicSentiment,
  analyzeAdvancedSentiment,
  analyzeReviewBatch,
  generateReviewSummary,
  extractKeyTopics
};