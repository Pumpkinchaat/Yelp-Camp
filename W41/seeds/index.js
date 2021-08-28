const mongoose = require("mongoose");
const cities = require("./cities");
const seedHelpers = require("./seedHelpers");
const Campground = require("../models/campgrounds");

mongoose.connect("mongodb://localhost:27017/yelp-camp" , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
})
.then(async ()=>{
    console.log("MONGO DB IS CONNECTED")
})
.catch(err => {console.log(err)});

async function seedFunction() {
    await Campground.deleteMany({});
    for (let i = 0 ; i < 30 ; i++) {
        const price = Math.trunc(Math.random() * 50) + 1;
        const title1 = seedHelpers.descriptors[Math.trunc(Math.random() * seedHelpers.descriptors.length)];
        const title2 = seedHelpers.places[Math.trunc(Math.random() * seedHelpers.places.length)];
        const title = `${title1} ${title2}`;
        const location = `${cities[Math.trunc(Math.random() * cities.length)].city}, ${cities[Math.trunc(Math.random() * cities.length)].state}`;
        const newSite = new Campground({title : title , location : location , image : "https://picsum.photos/1200/800" , price , description : "Nice Camping Place!!"});
        await newSite.save();
    }
}

seedFunction()
.then(()=>{
    console.log("Seed Successfull , NEW DUMMY DATA INSERTED");
    mongoose.connection.close();
})