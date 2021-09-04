const express = require("express");
const router = express.Router();
const {User} = require("../models/users");
const passport = require("passport");
const passportLocal = require("passport-local");
const catchAsync = require("../utils/catchAsync");

router.get("/register" , (req , res) => {
    res.render("users/register");
})

router.post("/register" , catchAsync(async (req , res) => {
    try {
        const {email , username , password} = req.body;
        const user = new User({email , username});
        const newUser = await User.register(user , password);
        await req.login(newUser , function(err) {
            if (err) return next(err);
            else {
                req.flash("success" , "Welcome to the YelpCamp")
                res.redirect("/campgrounds");
            }
        })
    } catch (err) {
        req.flash('fail' , err.message);
        res.redirect("/register");
    }
}));

router.get("/login" , (req , res) => {
    res.render("users/login");
})

router.post("/login" , passport.authenticate("local" , {failureFlash : true , successFlash : "Welcome Back!" , failureRedirect : "/login"}) , (req , res) => {
    const redirect = req.session.redirect || "/campgrounds";
    req.session.redirect = null;
    res.redirect(redirect);
})

router.get("/logout" , (req , res) => {
    req.logout();
    req.flash("success" , "GoodBye! Hope to see ya soon!");
    res.redirect("/campgrounds");
})

module.exports = router;