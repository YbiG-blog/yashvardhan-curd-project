//jshint esversion:6
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
require("./datacon/datacon");
//export modelRout
// const userRoute = require("./modelRoutes/User");
const User = require("./modelUser/User");
const app = express();


//Middlewares

app.use(express.json());
// app.use("/api/users", userRoute);



app.post("/register",(req, res) => {
  console.log(req.body);
  const newUser = new User(req.body);
  newUser.save().then(()=>{
    res.status(201).send(newUser);
  }).catch((err)=>{
res.status(400).send(err);
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("server is running at port 3000");
});