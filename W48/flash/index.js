const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }));
app.use(flash());

const arr = ["Susmit" , "Singh" , "is" , "my" , "name"];

app.use((req , res , next) => {
    res.locals.message = req.flash("success");
    next();
})

app.get("/" , (req , res) => {
    res.render("index" , {arr});
})

app.post("/" , (req , res) => {
    const {text} = req.body;
    arr.push(text);
    req.flash("success" , "The data insertion was a success");
    res.redirect("/");
})

app.listen(3000 , ()=> {
    console.log("Server on port 3000");
})