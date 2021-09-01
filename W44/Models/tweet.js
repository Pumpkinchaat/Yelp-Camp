const mongoose = require("mongoose");
const {Schema , model} = mongoose;

mongoose.connect('mongodb://localhost:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const userSchema = new Schema({
    name : String,
    age : Number
});

const tweetSchema = new Schema({
    text : String,
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

const User = model("User" , userSchema);
const Tweet = model("Tweet" , tweetSchema);

async function makeUser() {
    const newUser = new User({name : "Susmit" , age : 100});
    await newUser.save();
    console.log(newUser);
}

async function newTweet() {
    const user = await User.findOne({name : "Susmit"});
    const newTweet = new Tweet({text : "This is a new Tweet lolol"});
    newTweet.user = user;
    await newTweet.save();
    console.log(newTweet);
}

async function run() {
    await makeUser();
    await newTweet();
    const tweet = await Tweet.findOne({text : "This is a new Tweet lolol"}).populate('user' , 'age');
    console.log(tweet);
}

run();