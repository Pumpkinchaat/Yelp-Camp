module.exports.isLoggedIn = (req , res , next) => {
    if (req.isAuthenticated()) next();
    else {
        req.session.redirect = req.originalUrl;
        req.flash("fail" , "You need to login first");
        return res.redirect("/login");
    }
}