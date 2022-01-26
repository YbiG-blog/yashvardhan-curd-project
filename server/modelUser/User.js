const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
throw new Error("username is not Valid")
      } 
    }
  },
  rollnum:{
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min:5
  },
  phone:{
    type: Number,
    min: 10,
    unique: true,
    required: true
  }
});

const User = new mongoose.model("User",UserSchema)
module.exports = User;

