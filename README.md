.

🚗 CAReader-Ai – AI-Powered Car Information Platform

CAReader-Ai is an AI-enhanced car information platform that provides detailed vehicle insights, comparisons, and intelligent recommendations for car enthusiasts, buyers, and researchers. Instantly analyze car specifications, market trends, images, and reviews using AI-powered tools.

✨ Features
1. AI Car Information Assistant

Instant retrieval of vehicle specifications and features

Performance, engine, and mileage insights

Price estimation and market trend guidance

Conversational Q&A for car-related queries

2. Smart Car Comparison

Compare multiple cars side by side

AI-generated pros and cons analysis

Performance vs. price evaluation

Personalized recommendations based on user preferences

3. Intelligent Image Analysis

Detect car make, model, and year from images

Highlight features and vehicle condition

Auto-generate descriptive tags

4. Sentiment & Review Analysis

Analyze reviews for positive, negative, or neutral sentiment

Summarize pros, cons, and user feedback

Extract key topics and insights

📋 Prerequisites

Node.js (v22.14.0 or higher)

MongoDB Atlas account

Cloudinary account (for car images)

OpenAI or Anthropic API key (for AI features)

🚀 Installation
1. Clone the Repository
git clone https://github.com/imyogeshgaikwad/CAReader-Ai.git
cd CAReader-Ai

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file:

# Cloudinary
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


The application runs at http://localhost:8080

🎯 How to Use AI Features
1. AI Car Assistant

Open the AI assistant panel

Ask queries about car specifications, performance, or reviews

Receive detailed insights and explanations

2. Car Comparison

Select multiple cars from the database

Click "Compare"

AI generates a detailed side-by-side analysis

3. Image Analysis

Upload a car image

AI detects make, model, year, and key features

Auto-generates descriptive tags

4. Review Analysis

Analyze car reviews for sentiment

Summarize key points

Identify common pros, cons, and buyer feedback

📂 Project Structure

🔧 API Endpoints
AI Assistant

POST /api/ai/assistant – Ask car-related questions

GET /api/ai/conversation-history – Retrieve chat history

Car Comparison

POST /api/ai/compare – Compare multiple cars

POST /api/ai/recommendation – AI-based recommendation

Image Analysis

POST /api/ai/analyze-image – Detect car make/model/features

Review Analysis

POST /api/ai/analyze-review – Sentiment analysis of reviews

POST /api/ai/summarize-review – Generate review summary

💡 Tips for Best Results

Provide complete car details for assistant queries

Upload high-quality images for accurate recognition

Ask specific questions for precise AI responses

🐛 Troubleshooting

Invalid API Key: Check .env file

Connection Errors: Verify internet and API status

Rate Limiting: Wait or upgrade AI API plan

🚀 Deployment

Platforms: Railway, Render, Heroku, AWS

Set environment variables securely

Use authentication and rate limiting for AI endpoints

🎯 Future Enhancements

Multi-language support

Voice-based AI assistant

Predictive pricing for used cars

Personalized car recommendations

Virtual car tours with AI narration

📄 License

MIT License – free for personal and professional use
