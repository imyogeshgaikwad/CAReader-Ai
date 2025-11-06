const express = require("express");
const router = express.Router({ mergeParams: true }); // important for accessing :id
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// POST route for reviews
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  review.listing = listing._id;
  await review.save();
    req.flash("success","Review Added!");


  listing.reviews.push(review);
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
   req.flash("error","Review Deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
