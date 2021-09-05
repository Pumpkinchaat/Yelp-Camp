const express = require("express");
const Router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn , validateCampground , campgroundAuthorise} = require("../middleware");

Router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

Router.get('/new', isLoggedIn , (req, res) => {
    res.render('campgrounds/new');
})

Router.post('/', isLoggedIn , validateCampground, catchAsync(async (req, res, next) => {
    const {title , image , price , description , location} = req.body.campground;
    const author = res.locals.user._id;
    const campground = new Campground({title , image , price , description , location , author});
    await campground.save();
    req.flash("success" , "A New Campground was added successfully");
    res.redirect(`/campgrounds/${campground._id}`)
}))

Router.get('/:id', catchAsync(async (req, res,) => {
    const authBool = req.isAuthenticated();
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/show', { campground , authBool });
}));

Router.get('/:id/edit', isLoggedIn , campgroundAuthorise , catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
}))

Router.put('/:id', isLoggedIn , validateCampground, campgroundAuthorise , catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success" , `${campground.title} was updated successfully`);
    res.redirect(`/campgrounds/${campground._id}`)
}));

Router.delete('/:id', isLoggedIn , campgroundAuthorise , catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success" , "The Campground was deleted successfully");
    res.redirect('/campgrounds');
}));

module.exports = Router;