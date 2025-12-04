const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middlewares.js");
const userController = require('../controllers/user');

router.route("/signup")
    .get(userController.renderSignupPage)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginPage)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        (req, res, next) => {
            // Clear redirectUrl after successful login
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;
            console.log("Redirecting to:", redirectUrl);
            res.redirect(redirectUrl);
        }
    );

router.get("/logout", userController.logout);

module.exports = router;
