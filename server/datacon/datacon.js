const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-yash:yash2121@cluster0.6afcs.mongodb.net/csifinalprojectDB",{
  useNewUrlParser: true,
}).then(()=>{
  console.log("Connection with database is successfully")
}).catch((err)=>{
  console.log("no connection")
})