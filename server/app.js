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
const auth = require("./authUser/auth");
const nodemailer = require('nodemailer');

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/register",async(req,res)=>
{
     try{
         const Usersdata = await User.find();
         res.send(Usersdata);
     }catch(e)
     {
      res.send(e);
     }
})

app.post("/register", async(req, res) => {
    try{
const password = req.body.password;
const confirmpassword = req.body.confirmpassword;
const opt_num = Math.floor(1000 + Math.random() * 9000);
const checkpassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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
  confirmpassword:confirmpassword,
  isverified:false,
  otp_val:opt_num,
  resetpassword:password
    });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'localacc7906@gmail.com',
        pass: 'local#7906'
      }
    });
    


    const mailOptions = {
      from: 'localacc7906@gmail.com',
      to: 'yash2010146@akgec.ac.in, Nandini2013177@akgec.ac.in, big87505@gmail.com, 2573st@gmail.com',
      subject: 'CSI-2nd-year-team-work',
      text: "Welcome in CSI-2nd Year....coders\n"+"Verify your account through the given OTP\n"+opt_num,
             
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("OTP has been sent");
      }
    });
    const creatUser = await newUser.save();
    res.status(201).send({
      _id:creatUser._id,
      email:creatUser.email,
      phone:creatUser.phone,
      rollnum:creatUser.rollnum,
      address:creatUser.address,
      branch:creatUser.branch,
      year:creatUser.year,
      gen:creatUser.gen,
      otp_val:creatUser.otp_val
     });
  }
   else{
    res.send("password are not matching")
  }
}
else
{
  res.send("password formate is not correct")
}

  }catch(err){
  res.status(400).send(err);
    }


});


app.post("/login",async(req,res)=>{
  try{
const email = req.body.email;
const password = req.body.password;
const useremail = await User.findOne({email:email});
if(!useremail){
  return  res.status.send("Email or password is not valid");
}

const matchPassword = await bcrypt.compare(password,useremail.password);
const token = await useremail.generateAuthToken();

//  //add cookie
 res.cookie("jwt", token,{
  expires:new Date(Date.now() + 80000),
  httpOnly:true
});
if(matchPassword){ return  res.status(201).send(token);
}
else{
  res.send("Wrong password");
}

  }catch(err){
  res.status(400).send("Invalid details");
    }  
});
/////  password forgot and password rest

app.get("/password-forgot",(req,res,next)=>{
  res.send("password forgot ")
})
app.post('/password-forgot',async(req,res,next) =>
  {
    try{
    // const email = req.body.email;
    const useremail = await User.findOne({email: req.body.email});
    if(!useremail)  
    {
        return res.status(400).send("Email is not found");
    }
    else if(useremail)
    {       
            const changepassword = useremail.resetpassword;
            console.log(changepassword);
        
         const transporter = nodemailer.createTransport({
             service:"gmail",
             auth:{
              user : "localacc7906@gmail.com",
              pass:"local#7906"
             }
         });
         const mailOptions = {
             from:'localacc7906@gmail.com',
             to: 'yash2010146@akgec.ac.in, Nandini2013177@akgec.ac.in, big87505@gmail.com, 2573st@gmail.com',
    subject: 'CSI-2nd-year-team-work',
    text: "Welcome in CSI-2nd Year....coders\n"+"Your new password is below \n"+changepassword,
         };
         transporter.sendMail(mailOptions,function(error,info){
             if(error)
             {
                 console.log(error);
             }
             else
             {
                 console.log("Password sent");
             }
        })
         res.status(201).send("Your  password has been sent to your related email......")
        }
      }catch(err)
      {
          res.status(400).send("User details are correct");
      }
})

app.post('/opt-send',async(req,res,next) =>
  {    
      const useremail = await User.findOne({email: req.body.email});
      
      if(useremail){
      try{    
              console.log(useremail.otp_val)
             const transporter = nodemailer.createTransport({
                   service:"gmail",
                   auth:{
                       user : "localacc7906@gmail.com",
                       pass:"local#7906"
                   }
               });
               const mailOptions = {
                   from:"localacc7906@gmail.com",
                   from:'localacc7906@gmail.com',
             to: 'yash2010146@akgec.ac.in, Nandini2013177@akgec.ac.in, ',
    subject: 'CSI-2nd-year-team-work',
    text: "Welcome in CSI-2nd Year....coders\n"+"Your new password is below \n"+useremail.otp_val,
         };
               transporter.sendMail(mailOptions,function(error,info){
                   if(error)
                   {
                       console.log(error);
                   }
                   else
                   {
                       console.log("OTP sent");
                   }
              })
               res.status(201).send("OTP has been sent to your related email")
              }catch(err)
              {
                res.status(400).send(err);
              }
      }
      else
      {
          res.send("Invalid email")
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
