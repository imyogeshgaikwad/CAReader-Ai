const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1170",
    set: v => v === "" 
      ? "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1170"
      : v
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
