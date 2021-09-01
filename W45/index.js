const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Product = require("./models/products"); //getting the Product model
const Farm = require("./models/farm"); //getting the farm model

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
  res.render("home");
});

//FARM ROUTES

app.get("/farms" , async (req , res) => {
  const farms = await Farm.find({});
  console.log(farms);
  res.render("farms/index" , {farms});
})

app.get("/farms/new" , (req , res) => {
  res.render("farms/new");
})

app.post("/farms" , async (req , res) => {
  const newFarm = new Farm(req.body.farm);
  await newFarm.save();
  res.redirect("/farms");
})

app.get("/farms/:id" , async (req , res) => {
  const {id} = req.params;
  const farm = await Farm.findById(id).populate("products");
  res.render("farms/show" , {farm});
})

app.post("/farms/:id" , async(req , res) => {
  const farm = await Farm.findById(req.params.id);
  const product = req.body.product;
  const newProduct = new Product(product);
  farm.products.push(newProduct);
  await farm.save();
  newProduct.farm = farm;
  await newProduct.save();
  console.log(farm);
  console.log(newProduct);
  res.redirect("/farms");
})

app.get("/farms/:id/new" , async (req , res) => {
  const {id} = req.params;
  const farm = await Farm.findById(id);
  console.log(farm);
  res.render("products/new" , {farm});
  Farm.find
})

app.delete("/farms/:id" , async (req , res) => {
  const farm = await Farm.findById(req.params.id);
  await Farm.findByIdAndDelete(req.params.id);
  res.redirect("/");
})
//PRODUCT ROUTES

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product, id });
});

app.put("/products/:id", async (req, res) => {
  const { name, price, category } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (name) product.name = name;
  if (price) product.price = price;
  product.category = category;
  product.save();
  res.redirect(`/products/${id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { name, price, category } = req.body;
  const { id } = req.params;
  Product.findByIdAndDelete(id, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
  res.redirect("/products");
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { id, product, categories });
});

app.listen(PORT, () => {
  console.log(`[INFO] Server is listening on PORT ${PORT}`);
});
