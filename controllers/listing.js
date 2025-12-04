const Listing = require("../Models/listing.js");

module.exports.index = async (req, res) => {
    const { location } = req.query;

    let filter = {};

    // If user enters something in search bar
    if (location && location.trim() !== "") {
        filter.location = { $regex: location, $options: "i" };
    }

    // If filter is empty, it automatically returns ALL listings
    const allListings = await Listing.find(filter);
    const noResults = allListings.length === 0;
    if (noResults) {
        req.flash("error", `No listings found for ${location}. Try another location.`);
        return res.render("listings/index.ejs", { allListings: [], location: location || "" });
    }

    res.render("listings/index.ejs", { 
        allListings,
        location: location || "",   // send back search value
    });
};


module.exports.renderNew = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.postNewListing = async (req, res) => {
    // Safety: check req.file
    if (!req.file) {
        req.flash("error", "Image upload failed. Please try again.");
        return res.redirect("/listings/new");
    }

    const newlisting = new Listing(req.body.listing || {});

    newlisting.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    newlisting.owner = req.user._id;

    await newlisting.save();

    req.flash("success", "New Listing Created!");
    console.log("Uploaded:", req.file.path, req.file.filename);
    res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const updates = { ...(req.body.listing || {}) };

    const listing = await Listing.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else if (req.body.listing && req.body.listing.image) {
        listing.image = {
            url: req.body.listing.image,
            filename: listing.image?.filename || "listingimage"
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};
