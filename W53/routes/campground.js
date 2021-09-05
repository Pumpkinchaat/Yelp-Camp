const express = require("express");
const Router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn , validateCampground , campgroundAuthorise} = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

Router.route("/")
    .get(catchAsync(campgrounds.campgroundsIndex))
    .post(isLoggedIn , validateCampground, catchAsync(campgrounds.postCampgroundNewForm))

Router.get('/new', isLoggedIn , campgrounds.renderCampgroundNewForm);

Router.route("/:id")
    .get(catchAsync(campgrounds.getCampground))
    .put(isLoggedIn , validateCampground, campgroundAuthorise , catchAsync(campgrounds.putCampgroundEditForm))
    .delete(isLoggedIn , campgroundAuthorise , catchAsync(campgrounds.deleteCampground))

Router.get('/:id/edit', isLoggedIn , campgroundAuthorise , catchAsync(campgrounds.renderCampgroundEditForm));

module.exports = Router;