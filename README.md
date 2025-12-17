🚗 CAReader-Ai – AI-Powered Car Information Platform

CAReader-Ai is an AI-enhanced car information platform that delivers detailed vehicle insights, comparisons, and intelligent recommendations for car enthusiasts, buyers, and researchers.

✨ AI Features
1. AI Car Information Assistant

Instant vehicle data retrieval

Engine, performance, and specification insights

Car feature explanations

Price estimation and market trend guidance

Conversational Q&A for vehicle queries

2. Smart Car Comparison

Compare multiple cars side by side

AI-generated pros and cons analysis

Performance vs. price evaluation

Intelligent recommendations based on user preferences

3. Intelligent Image Analysis

Detect car make, model, and year from images

Highlight features and condition

Auto-generate tags from car images

4. Sentiment & Review Analysis

Analyze reviews for cars and models

Summarize pros, cons, and general sentiment

Extract key topics and buyer concerns

📋 Prerequisites

Node.js (v22.14.0 or higher)

MongoDB Atlas account

Cloudinary account (for car images)

Mapbox account (optional for location-based features)

OpenAI or Anthropic API key for AI-powered features

🚀 Installation Steps
1. Clone the Repository
git clone https://github.com/imyogeshgaikwad/CAReader-Ai.git
cd CAReader-Ai

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file:

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# MongoDB Atlas
ATLASDB_URL=your_mongodb_connection_string

# Session Secret
SECRET=your_session_secret

# AI Configuration
AI_PROVIDER=openai  # or anthropic
OPENAI_API_KEY=your_openai_api_key
# ANTHROPIC_API_KEY=your_anthropic_api_key (if using Claude)

4. Create Required Directories
mkdir -p ai models public/js

5. Start the Application
Development Mode
npm run dev

Production Mode
npm start


Application will run on http://localhost:8080

🎯 How to Use AI Features
1. AI Car Assistant

Open the AI assistant panel

Ask queries about car specifications, performance, or reviews

Receive detailed insights and explanations

2. Car Comparison

Select multiple cars from the database

Click "Compare"

AI generates a comprehensive analysis of specs, features, and value

3. Image Analysis

Upload a car image

AI detects make, model, year, and key features

Generates automatic tags and insights

4. Review Analysis

Analyze car reviews for sentiment

Summarize key points

Identify common pros, cons, and buyer feedback

📂 Project Structure
CAReader-Ai/
├── ai/                        # AI modules
│   ├── carAssistant.js
│   ├── comparison.js
│   ├── imageAnalysis.js
│   └── reviewAnalysis.js
├── models/
│   ├── car.js
│   ├── review.js
│   └── conversation.js        # AI assistant chats
├── routes/
│   ├── car.js
│   ├── review.js
│   └── ai.js                  # AI endpoints
├── views/
│   ├── cars/
│   ├── includes/
│   │   └── aiAssistant.ejs    # AI assistant UI
├── public/
│   ├── js/
│   │   └── aiFeatures.js
│   └── css/
├── app.js                      # Main application
├── .env
└── package.json

🔧 API Endpoints
AI Assistant Endpoints

POST /api/ai/assistant – Ask car-related questions

GET /api/ai/conversation-history – Retrieve chat history

Car Comparison Endpoints

POST /api/ai/compare – Compare multiple cars

POST /api/ai/recommendation – AI-based recommendation

Image Analysis Endpoints

POST /api/ai/analyze-image – Detect car make/model/features

Review Analysis Endpoints

POST /api/ai/analyze-review – Sentiment analysis of car reviews

POST /api/ai/summarize-review – Generate review summary

💡 Tips for Best Results

Provide complete car details when using the assistant

Upload high-quality images for better recognition

Ask specific questions for more accurate AI responses

🐛 Troubleshooting

Invalid API Key: Double-check .env file

Connection Errors: Verify internet and API service status

Rate Limiting: Wait or upgrade AI API plan

🚀 Deployment

Use platforms like Railway, Render, Heroku, or AWS

Set environment variables securely

Implement authentication and rate limiting for AI endpoints

🎯 Future Enhancements

Multi-language support

Voice-based AI car assistant

Predictive pricing for used cars

Personalized car recommendations

Virtual car tours with AI narration

📄 License

MIT License – free for personal and professional use
