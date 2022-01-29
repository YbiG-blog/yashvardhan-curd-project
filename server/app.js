//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require("./datacon/datacon");
const User = require("./modelUser/User");
// const auth = require("./authUser/auth");


const app = express();
/// twilio
/// twilio-otp-verification
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//Middlewares
app.use(express.json());
app.use(cookieParser());

/// for auth
// app.get("/home",auth,(req,res)=>{
  
//   res.send("this is home page")
// })

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
  address:req.body.address,
  year:req.body.year,
  branch:req.body.branch,
  gen:req.body.gen,
  confirmpassword:confirmpassword
    });
    // console.log(newUser);
  //   const token = await newUser.generateAuthToken();
  // console.log("token is here -> "+token)

  // //add cookie
  // res.cookie("jwt", token,{
  //   expires:new Date(Date.now()+600000),
  //   httpOnly:true
  // });
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


app.post("/login", async(req,res)=>{
  try{
const email = req.body.email;
const password = req.body.password;
const useremail = await User.findOne({email:email});
if(!useremail){
  return  res.status.send("Email or password is not valid");
}

const matchPassword = await bcrypt.compare(password,useremail.password);
// const token = await useremail.generateAuthToken();
// console.log("token is here -> "+token)
//  //add cookie
//  res.cookie("jwt", token,{
//   expires:new Date(Date.now() + 80000),
//   httpOnly:true
// });

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
app.post("/tpo-password",(req,res)=>{
  client.messages 
      .create({   
        msg: req.body.msg,
         messagingServiceSid: 'MG2fdf23d6e7d747d577ce3455d590cc06',      
         to: '+917818052057' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
})
app.get('/otp-send', (req,res) => {
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

app.get('/otp-verify', (req, res) => {
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

/////  password forgot and password rest

app.get("/password-forgot",(req,res,next)=>{
  res.send("hii ")
})

app.post("/password-forgot",async (req,res,next)=>{
  try{
    const email = req.body.email;
    const useremail = await User.findOne({email:email});
    if(!useremail){
      return  res.status.send("Email is not found");
    }
    else if(useremail)
    {const secret_key=process.env.JWT_SECRET+useremail.password;
      const payload={
        email:useremail.email,
        _id:useremail._id
      }
  const token=jwt.sign(payload,secret_key,{
    expiresIn:"10m"
  })
  
  const link_generate=`https://curd-web.herokuapp.com/password-reset/${useremail._id}/${token}`;
  console.log(link_generate);
  
      return  res.status(201).send("Password reset link has been sent to your email......\n"+`${link_generate}`);
    }

      }catch(err){
      res.status(400).send("Invalid details");
        }
})

app.get("/password-reset/:id/:token", async(req,res,next)=>{
  const userid=req.params.id;
  const usertoken=req.params.token;

const useremail = await User.findOne({_id:userid});
if(!useremail)
{
  return res.send('Invalid user-email...');
}
const secret=process.env.JWT_SECRET+useremail.password;
console.log(secret);
try{

  const verify_token=jwt.verify(usertoken,secret);
res.send({email:useremail.email});
}catch(err){
  res.status(400).send(err);
}
})

app.post("/password-reset/:id/:token", async(req,res,next)=>{
  const userid=req.params.id;
  const usertoken=req.params.token;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
const useremail = await User.findOne({_id:userid});
if(!useremail)
{
  return res.send('Invalid user-email...');
}
const secret=process.env.JWT_SECRET+useremail.password;
// console.log(secret);
try{

  const verify_token=jwt.verify(usertoken,secret);
useremail.password=password;
useremail.confirmpassword=confirmpassword;
const updateuser  = await useremail.save();
res.send(updateuser);

}catch(err){
  res.status(400).send(err);
}
})

app.use(cors());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("server is running at port 3000");
});