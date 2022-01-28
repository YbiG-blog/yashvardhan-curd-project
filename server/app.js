//jshint esversion:6
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require("./datacon/datacon");
const User = require("./modelUser/User");
const auth = require("./authUser/auth");


const app = express();
/// twilio-otp-verification
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH)

//Middlewares
app.use(express.json());
app.use(cookieParser());
//demo for next();
// app.use((req,res,next)=>{
//   console.log(req.ip);
//   // next();
// })
// app.get("/",(req,res)=>{
//   res.send("hii")
// })
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

/// for auth
app.get("/home",auth,(req,res)=>{
  res.send("this is home page")
})

app.post("/register", async(req, res) => {
    try{
const password = req.body.password;
const confirmpassword = req.body.confirmpassword;
const checkpassword= /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,10}$/ ;
if(checkpassword.test(password)){
if(password===confirmpassword){
    const newUser = new User({
  name: req.body.name,
  email: req.body.email,
  rollnum: req.body.rollnum,
  password: password,
  phone: req.body.phone,
  confirmpassword:confirmpassword
    });
    console.log(newUser);
    const token = await newUser.generateAuthToken();
  console.log("token is here -> "+token)

  //add cookie
  res.cookie("jwt", token,{
    expires:new Date(Date.now()+80000),
    httpOnly:true
  });
    const creatUser = await newUser.save();
    res.status(201).send(creatUser);
  }
  
  else{
    res.send("password are not matching")
  }
}else
{
  res.send("password formate is not correct");
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


// //////   twilio


app.get('/otp', (req,res) => {
  if (req.query.phonenumber) {
     client
     .verify
     .services(process.env.TWILIO_SERVICE_ID)
     .verifications
     .create({
         to: `+${req.query.phonenumber}`,
         channel: req.query.channel
     })
     .then(data => {
         res.status(200).send(data);
     })
    }
     else {
      res.status(400).send("wrong phone number")
   } 
})

app.get('/verify', (req, res) => {
  if (req.query.phonenumber && (req.query.code).length === 6) {
      client
          .verify
          .services(process.env.TWILIO_SERVICE_ID)
          .verificationChecks
          .create({
              to: `+${req.query.phonenumber}`,
              code: req.query.code
          })
          .then(data => {
            res.status(200).send(data);
        }) 
 } else {
     res.status(400).send("Invalid otp")
  }
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("server is running at port 3000");
});