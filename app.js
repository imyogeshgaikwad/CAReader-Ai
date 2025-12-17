if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const aiRouter = require("./routes/ai.js"); // NEW: AI routes

// DB CONNECTION
const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// EJS SETUP
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // NEW: For AI API endpoints
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// SESSION STORE
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET},
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH + CURRENT USER
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/api/ai", aiRouter); // NEW: AI API routes

// 404 HANDLER
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { message: err.message });
});

// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'not configured'}`);
});