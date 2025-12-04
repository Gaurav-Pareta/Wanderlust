const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log("isLoggedIn middleware triggered for URL:", req.originalUrl);
    if (!req.isAuthenticated()) {
        if (!req.session.redirectUrl) {
            req.session.redirectUrl = req.originalUrl;
        }
        if (req.originalUrl === '/login') {
            return res.status(403).send('Redirection loop detected.');
        }
        req.flash("error", "You must be logged in to continue");
        return res.redirect('/login');
    }
    next();
};



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl &&
        req.session.redirectUrl !== "/login" &&
        req.session.redirectUrl !== "/signup") {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Get owner's ObjectId whether populated or not
    const ownerId = listing.owner && listing.owner._id ? listing.owner._id : listing.owner;
    const currUserId = req.user && req.user._id ? req.user._id : null;

    if (!currUserId || !ownerId || !ownerId.equals(currUserId)) {
        req.flash("error", "You are not the owner of this listing.");
        if (req.originalUrl === `/listings/${id}`) {
            return res.status(403).send("Redirection loop detected.");
        }
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
