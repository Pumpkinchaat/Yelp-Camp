const mongoose = require("mongoose");
const {Schema , model} = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username : {
        type : String,
        required : [true , "Username is required"]
    },
    password : {
        type : String,
        required : [true , "Password is required"]
    }
});

userSchema.statics.findAndValidate = async function (username , password) {
    const user = await this.findOne({username});
    if (bcrypt.compare(password , user.password)) return user;
    else return false;
}

userSchema.pre("save" , async function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password , 12);
    next();
})

module.exports = model("User" , userSchema);