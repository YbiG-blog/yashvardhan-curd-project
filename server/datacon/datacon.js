const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_KEY,{
  useNewUrlParser: true,
}).then(()=>{
  console.log("Connection with database is successfully")
}).catch((err)=>{
  console.log("no connection")
})