const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  username: {
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
  },
  confirmpassword: {
    type: String,
    required: true
  },
  tokens:[{
    token:{
      type: String,
    required: true
    }
  }]
});
/// generate token
UserSchema.methods.generateAuthToken = async function(){
  try{
    const token = jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET);
   this.tokens=this.tokens.concat({token:token})
    await this.save();

     const userverify= await jwt.verify(token,process.env.JWT_SECRET);
     console.log(userverify)
     return token;    
  }catch(err)
  {
res.send(err);
  }
}

// authenticate password
UserSchema.pre("save", async function(next){
  if(this.isModified("password")){
    // console.log(this.password)
    this.password= await bcrypt.hash(this.password,saltRounds);
    // console.log(this.password)
    this.confirmpassword = await bcrypt.hash(this.password,saltRounds);
  }
  next();
})
const User = new mongoose.model("User",UserSchema)
module.exports = User;

