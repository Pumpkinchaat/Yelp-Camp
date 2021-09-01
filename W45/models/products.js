const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "The Price must be positive"],
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["dairy", "fruits", "vegetables"],
  },
  farm : {type : mongoose.Schema.Types.ObjectId , ref : "Farm"}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
