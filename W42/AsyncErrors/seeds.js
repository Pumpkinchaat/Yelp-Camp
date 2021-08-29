const mongoose = require("mongoose");
const Product = require("./models/products");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

const starterProducts = [
  {
    name: "Eggs",
    price: 50,
    category: "dairy",
  },
  {
    name: "Zuccinni",
    price: 10,
    category: "vegetables",
  },
  {
    name: "Apple",
    price: "12",
    category: "fruits",
  },
  {
    name: "Cucumber",
    price: "20",
    category: "fruits",
  },
];

Product.insertMany(starterProducts, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
