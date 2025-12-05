require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./Models/user.js");
const MongoStore = require('connect-mongo');


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");

const MONGO_URL = process.env.ATLASDB_URL;
const port = process.env.PORT || 8080;



// Connect to Mongo
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Mongo connection error:", err));

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

store.on("error", () => {
    console.log("Error in Mongo Session Store.")
})

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.location = "";
    next();
});

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Routes
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((error, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = error;
    res.status(statusCode).render("error/error.ejs", { message, statusCode });
});

// Middleware to log static file requests
app.use((req, res, next) => {
    if (req.url.startsWith('/css') || req.url.startsWith('/js')) {
        console.log(`Static file requested: ${req.url}`);
        console.log(`Resolved path: ${path.join(__dirname, 'public', req.url)}`);
    }
    next();
});

// Fallback route for static files
app.use((req, res, next) => {
    if (req.url.startsWith('/css') || req.url.startsWith('/js')) {
        console.error(`Static file not found: ${req.url}`);
    }
    next();
});

// Ensure static files are served in production
app.use((req, res, next) => {
    console.log(`Serving static file: ${req.url}`);
    next();
});

// Explicitly serve static files using absolute paths
app.use('/css', express.static('/opt/render/project/src/public/css'));
app.use('/js', express.static('/opt/render/project/src/public/js'));
app.use(express.static('/opt/render/project/src/public'));

// Log static file requests for debugging
app.use((req, res, next) => {
    if (req.url.startsWith('/css') || req.url.startsWith('/js')) {
        console.log(`Static file requested: ${req.url}`);
    }
    next();
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
