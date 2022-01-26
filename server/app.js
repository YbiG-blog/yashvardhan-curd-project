//jshint esversion:6
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require("./datacon/datacon");
//export modelRout
// const userRoute = require("./modelRoutes/User");
const User = require("./modelUser/User");
const app = express();


//Middlewares
app.use(cookieParser);
app.use(express.json());
// app.use("/api/users", userRoute);

/// find all user Data
app.get("/register", async(req, res)=>{
  
  try{
const userData = await User.find();
res.send(userData);
  }catch(err)
  {
  res.status(400).send(err); 
  }

});
app.get("/register/:userId", async (req, res)=> {
  try{
    const _id= req.params.userId;
    const singleUser = await User.findById(_id);
if(!singleUser)
{
 return res.status(404).send();
}
else
{
  res.send(singleUser);
}
      }catch(err)
      {
      res.status(400).send(err); 
      }
    const tittlename= req.params.userId;
  })

app.post("/register", async(req, res) => {
    try{
const password = req.body.password;
const confirmpassword = req.body.confirmpassword;
if(password===confirmpassword){
    const newUser = new User({
      name: req.body.name,
  email: req.body.email,
  rollnum: req.body.rollnum,
  password: password,
  phone: req.body.phone,
  confirmpassword:confirmpassword
    });
    // console.log(newUser);
    const token = await newUser.generateAuthToken();
  console.log("token is here -> "+token)

  //add cookie
  res.cookie("jwt", token,{
    expires:new Date(Date.now()+8000),
    httpOnly:true
  });
  console.log(req.cookies.jwt);
    const creatUser = await newUser.save();
    res.status(201).send(creatUser);
  }
  else{
    res.send("password are not matching")
  }
  }catch(err){
  res.status(400).send(err);
    }


});


/// login page

app.post("/login", async(req,res)=>{
  try{
const email = req.body.email;
const password = req.body.password;
const useremail = await User.findOne({email:email});
if(!useremail){
  return  res.status.send("Email or password is not valid");
}

const matchPassword = await bcrypt.compare(password,useremail.password);
const token = await useremail.generateAuthToken();
  console.log("token is here -> "+token)
 //add cookie
 res.cookie("jwt", token,{
  expires:new Date(Date.now()+80000),
  httpOnly:true
});
  
if(matchPassword){ return  res.status(201).send("login successfully");
}
else{
  res.send("Wrong password");
}

  }catch(err){
  res.status(400).send("Invalid details");
    }
    

});


// const createToken= async()=>{
//  const token = await jwt.sign({_id:"61f1882eb8fc6208a57ec0fe"},process.env.JWT_SECRET,{expiresIn: "3 minutes"});
//  console.log(token);

//  const userverify= await jwt.verify(token,process.env.JWT_SECRET);
//  console.log(userverify)
// }
// createToken();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("server is running at port 3000");
});