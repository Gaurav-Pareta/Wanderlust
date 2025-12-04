const User = require("../Models/user.js"); 

module.exports.renderSignupPage = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            delete req.session.redirectUrl;   // ⭐ important fix

            req.flash("success", "New user registered");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginPage = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to wonderlust.");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl; // ⭐ mandatory so loop stops

    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out successfully.");
        res.redirect("/listings");
    });
};
