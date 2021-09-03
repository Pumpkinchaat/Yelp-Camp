const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
const user = require("./models/user");
const app = express();

const HASH = 12;
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

app.use(express.urlencoded({ extended : true}));
app.use(session({
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true
}))

mongoose.connect('mongodb://localhost:27017/testAuth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("[MONGO] Database is connected");
})
.catch((err) => {
    console.log(err);
})

const validate = async function (req , res , next) {
    if (!req.session.user_id) res.redirect("login");
    else next();
}

app.get("/" , (req , res) => {
    res.send("This is the homepage");
})

app.get("/register" , (req , res) => {
    res.render("register");
})

app.post("/register" , async (req , res) => {
    let {username , password} = req.body;
    const newUser = new User({username , password});
    await newUser.save();
    req.session.user_id = newUser._id;
    res.redirect("/");
})

app.get("/login" , (req , res) => {
    res.render("login");
})

app.post("/login" , async (req , res) => {
    const {username , password} = req.body;
    const user = await User.findAndValidate(username , password);
    console.log(user);
    if (!user) return res.redirect("/login");
    else {
        req.session.user_id = user._id;
        res.redirect("/secret");
    }
})

app.post("/logout" , (req , res) => {
    req.session.destroy();
    res.redirect("/");
})

app.get("/secret" , validate , (req  ,res) => {
    res.render("secret");
})

app.listen(3000 , () => {
    console.log("Server is serving you on port 3000");
})