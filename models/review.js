const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"]
  },
  comment: {
    type: String,
    trim: true,
    required: [true, "Review comment is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  listing: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Listing"
},
author : {
  type: Schema.Types.ObjectId,
  ref: "User",
}


});

module.exports = mongoose.model("Review", reviewSchema);
