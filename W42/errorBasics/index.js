const express = require("express");
const app = express();
const AppError = require("./AppError");

app.use((req , res , next) => {
    req.requestTime = Date.now();
    console.log(req.method.toUpperCase() , req.path);
    next();
})

const verifyPassword = function(req , res , next) {
    const query = req.query.q;
    if(query === "secretPasswordLol") res.send("I like pandas");
    throw new AppError("This is an error" , 402);
}

app.get("/" , (req , res) => {
    res.send("This is the HOMEPAGE");
})

app.get("/dogs" , (req , res) => {
    console.log("[INFO] I love dogs BUT NOT CHICHUAHUA");
    res.send("This is the DOGS page hahaha no cache");
})

app.get("/cats" , (req , res) => {
    res.send("This is the CATS page");
})

app.get("/secret" , verifyPassword , (req , res) => {
    res.send("ACCESS DENIED");
})

app.use((req , res) => {
    res.status(404).send("The page was not found");
})

app.use((err , req , res , next) => {
    err.currentTime = Date.now();
    console.log("*************************************");
    console.log("****************ERROR****************");
    console.log("*************************************");
    next(err);
})

app.use((err , req , res , next) => {
    const {status = 500 , message = "Bruh sad emoji"} = err;
    res.status(status).send(message);
})

app.listen(3000 , () => {
    console.log("Server listening on PORT 3000");
})