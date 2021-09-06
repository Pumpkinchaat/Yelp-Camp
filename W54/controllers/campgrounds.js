const Campground = require('../models/campground');

module.exports.campgroundsIndex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderCampgroundNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.postCampgroundNewForm = async (req, res, next) => {
    const {title , image , price , description , location} = req.body.campground;
    const author = res.locals.user._id;
    const campground = new Campground({title , image , price , description , location , author});
    await campground.save();
    req.flash("success" , "A New Campground was added successfully");
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.getCampground = async (req, res,) => {
    const authBool = req.isAuthenticated();
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/show', { campground , authBool });
};

module.exports.renderCampgroundEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("fail" , "The campground was not found");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.putCampgroundEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success" , `${campground.title} was updated successfully`);
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success" , "The Campground was deleted successfully");
    res.redirect('/campgrounds');
};