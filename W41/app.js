const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campgrounds");
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

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

app.post("/campgrounds" , async (req , res) => {
    const { campground } = req.body;
    const newSite = new Campground(campground);
    await newSite.save();
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new" , (req , res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id" , async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show" , {campground});
})

app.get("/campgrounds/:id/update" , async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/update" , {campground});
})

app.put("/campgrounds/:id" , async (req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    campground.title = req.body.campground.title;
    campground.location = req.body.campground.location;
    campground.price = req.body.campground.price;
    campground.description = req.body.campground.description;
    campground.image = req.body.campground.image;
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
})

app.delete("/campgrounds/:id" , async(req , res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

app.listen(PORT , () => {
    console.log(`Server is listenin gon PORT ${PORT}`);
})