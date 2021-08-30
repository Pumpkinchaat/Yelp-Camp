const mongoose = require("mongoose");

const Campground = require("./models/campgrounds");
mongoose.connect("mongodb://localhost:27017/test" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("MONGO DB IS CONNECTED")})
.catch(err => {console.log(err)});

