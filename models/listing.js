const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  // NEW: AI-enhanced fields
  aiGenerated: {
    description: {
      type: Boolean,
      default: false
    },
    lastUpdated: Date
  },
  aiMetadata: {
    suggestedPrice: Number,
    priceConfidence: String,
    imageTags: [String],
    imageQualityScore: Number,
    sentimentScore: Number,
    reviewSummary: String
  },
  amenities: [String],
  propertyType: {
    type: String,
    default: 'accommodation'
  }
}, {
  timestamps: true
});

// Middleware to delete associated reviews when listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Method to update AI metadata
listingSchema.methods.updateAIMetadata = function(metadata) {
  this.aiMetadata = { ...this.aiMetadata, ...metadata };
  return this.save();
};

// Virtual for review count
listingSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

// Virtual for average rating (calculated from reviews)
listingSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  // This will be populated when reviews are fetched
  return this._averageRating || 0;
});

module.exports = mongoose.model('Listing', listingSchema);