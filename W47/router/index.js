const express = require("express");
const app = express();
const dogs = require("./routes/dog");
const home = require("./routes/admin");
const cats = require("./routes/cat");

app.use("/dogs" , dogs);
app.use("/cats" , cats);
app.use("/" , home);

app.use((req , res) => {
    res.status(404).send("The Page Was Not Found");
})

app.listen(3000 , ()=>{
    console.log("[INFO] Server now listening on PORT 3000");
})