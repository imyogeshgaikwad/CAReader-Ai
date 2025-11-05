const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");




const MONGO_URL ="mongodb://127.0.0.1:27017/temp"
main().then(()=>{
    console.log("DB connected");
}).catch(err =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi I am root!")
});



const validateListing = (req,res,next) =>{
     let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

const validateReview = (req,res,next) =>{
     let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}



//index route
app.get("/listings",wrapAsync(async(req,res)=>{
 const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", { listing });
}));


//Create Route
app.post("/listings",validateListing, wrapAsync(async(req,res)=>{
   
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


//Update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${id}`);
}));


// DELETE ROUTE
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//Reviews
//POst Route
// POST route for creating a review
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    

    const review = new Review(req.body.review);
    review.listing = listing._id; // optional, if reviewSchema includes listing ref
    await review.save();

    listing.reviews.push(review);
    await listing.save();

    console.log("✅ New review saved");
    res.redirect(`/listings/${listing._id}`);
}));


// Catch-all for unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{message});

    // res.status(statusCode).send(message);
});



app.listen(8080,()=>{
     console.log("server is listening on port 8080")
});