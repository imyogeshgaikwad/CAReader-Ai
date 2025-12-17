const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// AI imports
const sentimentAnalysis = require("../ai/sentimentAnalysis.js");

// Create Review
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  // AI: Analyze sentiment of the review
  try {
    const basicSentiment = sentimentAnalysis.analyzeBasicSentiment(newReview.comment);
    
    await newReview.updateSentiment({
      score: basicSentiment.score,
      label: basicSentiment.sentiment
    });

    // Advanced sentiment analysis (async, non-blocking)
    sentimentAnalysis.analyzeAdvancedSentiment(newReview.comment)
      .then(advancedAnalysis => {
        newReview.aiAnalysis = {
          themes: advancedAnalysis.key_themes || [],
          strengths: advancedAnalysis.strengths || [],
          weaknesses: advancedAnalysis.weaknesses || [],
          emotion: advancedAnalysis.emotion || 'neutral',
          confidence: advancedAnalysis.confidence || 0
        };
        return newReview.save();
      })
      .catch(err => console.error("Advanced sentiment analysis error:", err));

  } catch (error) {
    console.error("Sentiment analysis error:", error);
    // Continue without sentiment analysis if it fails
  }

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  // AI: Update listing's review summary (async)
  updateListingReviewSummary(listing._id).catch(err => 
    console.error("Review summary update error:", err)
  );

  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  // AI: Update listing's review summary after deletion (async)
  updateListingReviewSummary(id).catch(err => 
    console.error("Review summary update error:", err)
  );

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

// Helper function to update review summary
async function updateListingReviewSummary(listingId) {
  const listing = await Listing.findById(listingId).populate('reviews');
  
  if (!listing || listing.reviews.length === 0) {
    return;
  }

  try {
    const reviewAnalysis = await sentimentAnalysis.analyzeReviewBatch(listing.reviews);
    const summary = await sentimentAnalysis.generateReviewSummary(listing.reviews);
    
    await listing.updateAIMetadata({
      sentimentScore: reviewAnalysis.average_score,
      reviewSummary: summary
    });
  } catch (error) {
    console.error("Error updating review summary:", error);
  }
}

module.exports = router;