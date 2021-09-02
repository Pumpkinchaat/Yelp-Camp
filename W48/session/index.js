const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }));

app.get("/viewcount" , (req , res) => {
    if (!req.session.count) req.session.count = 1;
    else req.session.count += 1;
    res.send(`This page has been visited ${req.session.count} times`);
})

app.get("/login/:id/:pass" , (req , res) => {
    const {id , pass} = req.params;
    if (pass !== 'secretCode') res.send("ACCESS DENIED");
    else {
        req.session.userId = id;
        res.redirect('/greet');
    }
});

app.get("/greet" , (req , res) => {
    res.send(`Welcome ${req.session.userId}`);
})

app.listen(3000 , ()=>{
    console.log("[PORT 3000]");
})