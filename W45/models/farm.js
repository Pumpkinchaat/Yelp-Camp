const mongoose = require("mongoose");
const {Schema , model} = mongoose;
const Product = require("./products");

const farmSchema = new Schema({
    name : {
        type : String,
        required : [true , "A Name of the farm is required"]
    },
    owner : {
        type : String,
        required : [true , "A Farm Owner is needed"]
    },
    products : [{type : Schema.Types.ObjectId , ref : "Product"}]
});

farmSchema.post('findOneAndDelete', async function (farm) {
    await Product.deleteMany({farm : farm._id});
})

const Farm = model("Farm" , farmSchema);

module.exports = Farm;