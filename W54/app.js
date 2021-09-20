if (process.env.NODE_ENV != 'production') {
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campgroundRoute = require("./routes/campground");
const reviewRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const {User} = require("./models/users");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

mongoose.set('useFindAndModify', false);

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname , "/public")));
app.use(session({
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(User.createStrategy());

app.use((req , res , next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash("success");
    res.locals.fail = req.flash("fail");
    next();
})

app.get('/', (req, res) => {
    res.redirect("/campgrounds");
});

app.use("/" , usersRoute);
app.use("/campgrounds" , campgroundRoute);
app.use("/campgrounds/:id/review" , reviewRoute);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`)
})