const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// AI imports
const sentimentAnalysis = require("../ai/sentimentAnalysis.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // Calculate average rating
  if (listing.reviews.length > 0) {
    const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    listing._averageRating = (totalRating / listing.reviews.length).toFixed(1);
  }

  // AI: Analyze reviews if not already done
  if (listing.reviews.length > 0 && !listing.aiMetadata.reviewSummary) {
    try {
      const reviewAnalysis = await sentimentAnalysis.analyzeReviewBatch(listing.reviews);
      const summary = await sentimentAnalysis.generateReviewSummary(listing.reviews);
      
      await listing.updateAIMetadata({
        sentimentScore: reviewAnalysis.average_score,
        reviewSummary: summary
      });
    } catch (error) {
      console.error("Review analysis error:", error);
    }
  }

  res.render("listings/show.ejs", { listing });
}));

// Create Route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  
  // Check if description was AI generated
  if (req.body.listing.aiGenerated) {
    newListing.aiGenerated = {
      description: true,
      lastUpdated: new Date()
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  
  res.render("listings/edit.ejs", { listing, originalImageUrl });
}));

// Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // Update listing fields
  Object.assign(listing, req.body.listing);

  // Update image if new one uploaded
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };

    
  }

  // Track AI-generated content
  if (req.body.listing.aiGenerated) {
    listing.aiGenerated = {
      description: true,
      lastUpdated: new Date()
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;