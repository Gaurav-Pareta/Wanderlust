const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

module.exports.postReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!")
    console.log("New Review Saved");
    res.redirect(`/listings/${req.params.id}`);
    
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("New Review Saved");
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`)
}