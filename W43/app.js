const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/expressError");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");
const Campground = require("./models/campgrounds");
const validationSchema = require("./validationSchema");
const { campgroundSchema } = require("./lec/lec/schemas");
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp-camp" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("MONGO DB IS CONNECTED")})
.catch(err => {console.log(err)});

app.engine("ejs" , ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/" , (req , res) => {
    res.redirect("/campgrounds");
})

function campgroundFormValidation(req , res , next) {
    const {campground} = req.body;
    const {value , error} = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        const err = new ExpressError(message , 400);
        next(err);
    }
    else next();
}

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

app.post("/campgrounds" , campgroundFormValidation , catchAsync(async (req , res) => {
    const { campground } = req.body;
    const newSite = new Campground(campground);
    await newSite.save();
    res.redirect("/campgrounds");
}));

app.get("/campgrounds/new" , (req , res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id" , catchAsync(async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show" , {campground});
}));

app.get("/campgrounds/:id/update" , catchAsync(async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/update" , {campground});
}));

app.put("/campgrounds/:id" , campgroundFormValidation , catchAsync(async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    campground.title = req.body.campground.title;
    campground.location = req.body.campground.location;
    campground.price = req.body.campground.price;
    campground.description = req.body.campground.description;
    campground.image = req.body.campground.image;
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id" , catchAsync(async(req , res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.use((req , res , next) => {
    console.log("this was hit");
    throw new ExpressError("No path was found :(" , 404);
})

app.use((err , req , res , next) => {
    if (!err.status) err.status = 500;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(err.status).render("error" , {err});
})

app.listen(PORT , () => {
    console.log(`Server is listenin gon PORT ${PORT}`);
})