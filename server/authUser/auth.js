const jwt = require('jsonwebtoken');
const User = require("../modelUser/User");
const cookieParser = require('cookie-parser')

const auth = async(req,res,next)=>{
    try{
const token = req.cookies.jwt;
const userverify = jwt.verify(token, process.env.JWT_SECRET);
console.log(userverify)
const user= await User.findOne({_id: userverify._id});
console.log(user);
next();
    }catch(err){
res.status(400).send(err);
    }
}

module.exports = auth;