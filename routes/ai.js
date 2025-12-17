const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Conversation = require('../models/conversation');
const chatbot = require('../ai/chatbot');
const textGenerator = require('../ai/textGenerator');
const sentimentAnalysis = require('../ai/sentimentAnalysis');
const pricePrediction = require('../ai/pricePrediction');

// Middleware to get or create session ID
router.use((req, res, next) => {
  if (!req.session.aiSessionId) {
    req.session.aiSessionId = uuidv4();
  }
  next();
});

// ========== CHATBOT ROUTES ==========

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.session.aiSessionId;
    const userId = req.user ? req.user._id : null;

    // Get or create conversation
    const conversation = await Conversation.findOrCreate(sessionId, userId);
    
    // Get conversation history (last 10 messages)
    const history = conversation.getRecentMessages(10);
    
    // Chat with AI
    const response = await chatbot.chat(message, history);
    
    // Save messages
    await conversation.addMessage('user', message);
    await conversation.addMessage('assistant', response.message);

    res.json({
      success: true,
      message: response.message,
      sessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your message. Please try again.'
    });
  }
});

// Generate travel itinerary
router.post('/itinerary', async (req, res) => {
  try {
    const { destination, days, interests } = req.body;
    
    if (!destination || !days) {
      return res.status(400).json({
        success: false,
        error: 'Destination and number of days are required'
      });
    }

    const itinerary = await chatbot.generateItinerary(
      destination,
      days,
      interests || []
    );

    res.json({
      success: true,
      itinerary
    });
  } catch (error) {
    console.error('Itinerary generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary'
    });
  }
});

// Get destination recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { budget, travelStyle, interests, season } = req.body;
    
    const recommendations = await chatbot.getDestinationRecommendations({
      budget: budget || 'moderate',
      travelStyle: travelStyle || 'balanced',
      interests: interests || [],
      season: season || 'any'
    });

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// ========== TEXT GENERATION ROUTES ==========

// Generate listing description
router.post('/generate-description', async (req, res) => {
  try {
    const { title, location, country, price, amenities } = req.body;
    
    if (!title || !location || !country) {
      return res.status(400).json({
        success: false,
        error: 'Title, location, and country are required'
      });
    }

    const description = await textGenerator.generateListingDescription({
      title,
      location,
      country,
      price: price || 100,
      amenities: amenities || []
    });

    res.json({
      success: true,
      description
    });
  } catch (error) {
    console.error('Description generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate description'
    });
  }
});

// Enhance existing description
router.post('/enhance-description', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    const enhanced = await textGenerator.enhanceDescription(description);

    res.json({
      success: true,
      description: enhanced
    });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enhance description'
    });
  }
});

// Generate title suggestions
router.post('/generate-titles', async (req, res) => {
  try {
    const { location, propertyType } = req.body;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        error: 'Location is required'
      });
    }

    const titles = await textGenerator.generateTitleSuggestions(
      location,
      propertyType || 'accommodation'
    );

    res.json({
      success: true,
      titles
    });
  } catch (error) {
    console.error('Title generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate titles'
    });
  }
});

// ========== SENTIMENT ANALYSIS ROUTES ==========

// Analyze single review
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { text, advanced } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    const analysis = advanced 
      ? await sentimentAnalysis.analyzeAdvancedSentiment(text)
      : sentimentAnalysis.analyzeBasicSentiment(text);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiment'
    });
  }
});

// Generate review summary
router.post('/review-summary', async (req, res) => {
  try {
    const { reviews } = req.body;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({
        success: false,
        error: 'Reviews array is required'
      });
    }

    const summary = await sentimentAnalysis.generateReviewSummary(reviews);
    const analysis = await sentimentAnalysis.analyzeReviewBatch(reviews);
    const topics = await sentimentAnalysis.extractKeyTopics(reviews);

    res.json({
      success: true,
      summary,
      analysis,
      topics
    });
  } catch (error) {
    console.error('Review summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary'
    });
  }
});

// ========== IMAGE ANALYSIS ROUTES ==========

// Analyze property image
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image'
    });
  }
});

// Generate image tags
router.post('/generate-image-tags', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is required'
      });
    }

    res.json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Tag generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate tags'
    });
  }
});

// ========== PRICE PREDICTION ROUTES ==========

// Predict optimal price
router.post('/predict-price', async (req, res) => {
  try {
    const { location, country, propertyType, bedrooms, amenities, currentPrice } = req.body;
    
    if (!location || !country) {
      return res.status(400).json({
        success: false,
        error: 'Location and country are required'
      });
    }

    const prediction = await pricePrediction.predictOptimalPrice({
      location,
      country,
      propertyType,
      bedrooms,
      amenities: amenities || [],
      currentPrice
    });

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to predict price'
    });
  }
});

// Analyze pricing trends
router.post('/pricing-trends', async (req, res) => {
  try {
    const { location, country } = req.body;
    
    if (!location || !country) {
      return res.status(400).json({
        success: false,
        error: 'Location and country are required'
      });
    }

    const trends = await pricePrediction.analyzePricingTrends(location, country);

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze trends'
    });
  }
});

// Get conversation history
router.get('/conversation-history', async (req, res) => {
  try {
    const sessionId = req.session.aiSessionId;
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.json({
        success: true,
        messages: []
      });
    }

    res.json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve history'
    });
  }
});

module.exports = router;