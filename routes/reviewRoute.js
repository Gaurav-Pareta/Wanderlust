const express = require("express");
const router = express.Router({mergeParams: true});
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require("../utils/middlewares.js");

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error);
    } else{
        next();
    }
}

router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.postReview));
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;