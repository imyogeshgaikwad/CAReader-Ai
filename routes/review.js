const express = require("express");
const router = express.Router({ mergeParams: true }); // important for accessing :id
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")


// POST route for reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new  Review(req.body.review);
  newReview.author = req.user._id
  console.log(newReview)
  newReview.listing = listing._id;
  await newReview.save();
    req.flash("success","Review Added!");


  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
   req.flash("error","Review Deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
