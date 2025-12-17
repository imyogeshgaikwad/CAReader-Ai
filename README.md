🚗 CAReader-Ai – AI-Powered Car Information Platform

CAReader-Ai is an AI-enhanced car information platform that provides detailed vehicle insights, comparisons, and intelligent recommendations for car enthusiasts, buyers, and researchers.

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

Upload a car image

AI detects make, model, year, and key features

Auto-generates descriptive tags

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
│   └── conversation.js
├── routes/
│   ├── car.js
│   ├── review.js
│   └── ai.js
├── views/
│   ├── cars/
│   └── includes/
│       └── aiAssistant.ejs
├── public/
│   ├── js/
│   │   └── aiFeatures.js
│   └── css/
├── app.js
├── .env
└── package.json

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

📋 Installation

Clone the repository:

git clone https://github.com/imyogeshgaikwad/CAReader-Ai.git
cd CAReader-Ai


Install dependencies:

npm install


Create a .env file and add your configuration:

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
AI_PROVIDER=openai  # or anthropic
OPENAI_API_KEY=your_openai_api_key
# ANTHROPIC_API_KEY=your_anthropic_api_key (if using Claude)


Create required directories:

mkdir -p ai models public/js


Start the app:

npm run dev      # Development
npm start        # Production


Application runs at http://localhost:8080
