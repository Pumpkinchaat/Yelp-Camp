const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    price: {
        type : Number,
        required : true,
        min : [0 , "The Minimum Price should be 0"]
    },
    description: {
        type : String,
        required : true
    },
    location: {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
});

module.exports = mongoose.model("Campground" , campgroundSchema);