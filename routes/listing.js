const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");





const validateListing = (req,res,next) =>{
     let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}



//index route
router.get("/",wrapAsync(async(req,res)=>{
 const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new ExpressError(404, "Car not found"),
        req.flash("error","Listing you requested does not exist!"),
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}));



//Create Route
router.post("/",validateListing, wrapAsync(async(req,res)=>{
   
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    req.flash("success","New Car Added!");
    res.redirect("/listings");
    
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
      req.flash("success", "Car details edited successfully!");
    res.render("listings/edit.ejs", { listing });
}));


// Update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
  req.flash("success", "Car details updated successfully!");
  res.redirect(`/listings/${id}`);
}));


// DELETE ROUTE
router.delete("/:id",wrapAsync( async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Car information deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;
