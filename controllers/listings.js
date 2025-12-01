const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}



module.exports.showListing = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews",
        populate:{
          path:"author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  })


  module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename}
      await newListing.save();
  
      req.flash("success", "New Car Added!");
      res.redirect(`/listings/${newListing._id}`);
    }


    module.exports.renderEditForm = (async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
    
        if (!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
        }
        
        res.render("listings/edit.ejs", { listing });
      })

      module.exports.updateListing = async (req, res) => {
          const { id } = req.params;
      
          const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
            runValidators: true,
            new: true,
          });
          if( typeof req.file!=="undefined"){
             let url = req.file.path;
             let filename = req.file.filename;
             updatedListing.image = {url, filename}
             await updatedListing.save()
          }
      
          req.flash("success", "Car details updated successfully!");
          res.redirect(`/listings/${updatedListing._id}`);
        }


        module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Car information deleted successfully!");
    res.redirect("/listings");
  }