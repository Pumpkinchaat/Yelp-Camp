const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("C@pt!anUnDerp@nt$"));

app.get("/recieve" , (req , res) => {
    res.cookie("name" , "Susmit");
    res.send("U are sent some non signed cookies");
})

app.get("/send" , (req , res) => {
    console.log(req.cookies);
    res.send(`These are some recieved cookies<br>${req.cookies.name}`);
})

app.get("/secretRecieve" , (req , res) => {
    res.cookie("age" , "20" , {signed : true});
    res.send("Sent u some secret cookies lol");
})

app.get("/secretSend" , (req , res) => {
    const {age} = req.signedCookies;
    if (age) console.log(age);
    else console.log("wtf u lyin");
    res.send("okay done bye bye");
})

app.listen(3000 , ()=>{
    console.log("[INFO] Server listening on PORT 3000");
})