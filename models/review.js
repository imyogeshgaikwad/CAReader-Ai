const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  // NEW: AI sentiment analysis fields
  sentiment: {
    score: Number,
    label: {
      type: String,
      enum: ['very positive', 'positive', 'neutral', 'negative', 'very negative']
    },
    analyzed: {
      type: Boolean,
      default: false
    },
    analyzedAt: Date
  },
  aiAnalysis: {
    themes: [String],
    strengths: [String],
    weaknesses: [String],
    emotion: String,
    confidence: Number
  }
}, {
  timestamps: true
});

// Method to update sentiment
reviewSchema.methods.updateSentiment = function(sentimentData) {
  this.sentiment = {
    ...sentimentData,
    analyzed: true,
    analyzedAt: new Date()
  };
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);