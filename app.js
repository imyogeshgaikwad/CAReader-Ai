const express = require("express");
const app =  express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



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

//index route
app.get("/listings",async(req,res)=>{
 const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing})
    
});

//Create Route
app.post("/listings", async(req,res)=>{
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});


//Update route
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id",async(req,res)=>{
      const { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     res.redirect("/listings")
});
app.listen(8080,()=>{
     console.log("server is listening on port 8080")
});