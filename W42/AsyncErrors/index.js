const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Product = require("./models/products"); //getting the Product model
const AppError = require("../errorBasics/AppError");

function wrapAsync (fn) {
  return function (req , res , next) {
    fn(req , res , next).catch(err => next(err));
  }
}

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruits", "vegetables", "dairy"];

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.get("/products", wrapAsync(async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
}));

app.post("/products", (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save();
  res.redirect("/products");
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.get("/products/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product, id });
}));

app.put("/products/:id", wrapAsync(async (req, res) => {
  const { name, price, category } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (name) product.name = name;
  if (price) product.price = price;
  product.category = category;
  product.save();
  res.redirect(`/products/${id}`);
}));

app.delete("/products/:id", wrapAsync(async (req, res) => {
  const { name, price, category } = req.body;
  const { id } = req.params;
  Product.findByIdAndDelete(id, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
  res.redirect("/products");
}));

app.get("/products/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { id, product, categories });
}));

function ValidationErrorHandler (err) {
  return new AppError("There was a validation Error" , 400);
} 

app.use((err , req , res , next) => {
  if (err.name === "ValidationError") err = ValidationErrorHandler(err);
  next(err);
})

app.use((err , req , res , next) => {
  const {status = 500 , message = "Something went wrong @ Server Side"} = err;
  res.status(status).send(message);
})

app.listen(PORT, () => {
  console.log(`[INFO] Server is listening on PORT ${PORT}`);
});
