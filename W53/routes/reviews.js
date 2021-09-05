const express = require("express");
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require("../models/reviews");
const {isLoggedIn , validateReview , reviewsAuthorise} = require("../middleware");

Router.post("/" , isLoggedIn , validateReview , catchAsync(async (req,  res) => {
    const {id} = req.params;
    const {review} = req.body;
    const {user} = res.locals;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    const newReview = new Review({...review , author:user});
    newReview.campground = campground;
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    req.flash("success" , "New Review was added successfully")
    res.redirect(`/campgrounds/${id}`);
}));

Router.delete("/:reviewId" , isLoggedIn , reviewsAuthorise , async(req , res) => {
    const {id , reviewId} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    await campground.reviews.pull({_id : reviewId});
    await campground.save();
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review was deleted successfully")
    res.redirect(`/campgrounds/${id}`);
});

module.exports = Router;