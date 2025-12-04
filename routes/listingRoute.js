const express = require("express");
const router = express.Router();
const { listingSchema } = require('../schema.js');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require('../utils/middlewares.js');
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require('../cloudinaryConfig.js');

const upload = multer({ storage });

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// Collection routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.postNewListing)
    );

// New form
router.get("/new", isLoggedIn, listingController.renderNew);

// Edit form 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

// Single-listing routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"), 
        validateListing,
        wrapAsync(listingController.editListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;
