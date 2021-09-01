const mongoose = require("mongoose");

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

const userSchema = mongoose.Schema({
    name : String,
    age : Number,
    address : [
        {
            _id : {id : false},
            street : String,
            country : String
        }
    ]
});

const User = mongoose.model("User" , userSchema);

async function addUser() {
    // const user = new User({name : "Harry Potter" , age : 17});
    // await user.save();
    // const user = await User.findOne({name : "Harry Potter"});
    // user.address.push({street : "Bengali Street" , country : "India"});
    // await user.save();
    // console.log(user);

    const user = new User({name : "Muhammad Ali" , age : 40});
    await user.save();
    user.address.push({street : "Bengali Street" , country : "India"});
    user.address.push({street : "Kolkata" , country : "Ramapuram"});
    await user.save();
    console.log(user);
}

addUser();