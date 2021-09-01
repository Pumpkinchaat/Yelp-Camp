const mongoose = require("mongoose");
const {Schema , model} = mongoose;

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
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

const farmSchema = new Schema({
  name : String,
  owner : String,
  product : [{ type : Schema.Types.ObjectId , ref : "Product"}]
});

const productSchema = new Schema({
  name : String,
  price : Number
});

const Farm = model("Farm" , farmSchema);
const Product = model("Product" , productSchema);

async function addFarm() {
  const farm = new Farm({name : "Singh Farm" , owner : "Susmit Singh"});
  await farm.save();
}

async function addProducts() {
  const farm = await Farm.findOne({name : "Singh Farm"});
  const aalo = Product({name : "Aalo" , price : 22});
  const brinjal = Product({name : "Brinjal" , price : 11});
  const mooli = Product({name : "Mooli" , price : 44});
  await aalo.save();
  await brinjal.save();
  await mooli.save();
  farm.product.push(aalo);
  farm.product.push(brinjal);
  farm.product.push(mooli);
  await farm.save();
  console.log(farm);
}

async function doShit() {
  await addFarm();
  await addProducts();
}

doShit();