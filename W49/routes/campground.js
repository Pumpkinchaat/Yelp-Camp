const express = require("express");
const Router = express.Router();
const { campgroundSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const flash = require("connect-flash");
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

Router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

Router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

Router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success" , "A New Campground was added successfully");
    res.redirect(`/campgrounds/${campground._id}`)
}))

Router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/show', { campground });
}));

Router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
}))

Router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success" , `${campground.title} was updated successfully`);
    res.redirect(`/campgrounds/${campground._id}`)
}));

Router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success" , "The Campground was deleted successfully");
    res.redirect('/campgrounds');
}));

module.exports = Router;