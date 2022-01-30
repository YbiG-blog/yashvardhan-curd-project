// /////  password forgot and password rest
//    const strongPasswords = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
// app.get("/password-forgot",(req,res,next)=>{

// })

// app.post("/password-forgot",async (req,res,next)=>{
//   try{
//     const email = req.body.email;
//     // const password = req.body.password;
//     const useremail = await User.findOne({email:email});
//     if(!useremail){
//       return  res.status.send("Email is not found");
//     }
//     else if(useremail)
//     {const secret_pass_key=process.env.JWT_SECRET+useremail.password;
//       const tk_ch_vy={
//         email:useremail.email,
//         _id:useremail._id
//       }
//   const token_create=jwt.sign(tk_ch_vy,secret_pass_key,{
//     expiresIn:"10m"
//   })
  
//   const link_generate=`http://localhost:3000/password-reset/${useremail._id}/${token_create}`;
//   console.log(link_generate);
  
//       return  res.status(201).send("Password reset link has been sent to your email......");
//     }

//       }catch(err){
//       res.status(400).send("Invalid details");
//         }
// })

// app.get("/password-reset/:id/:token", async(req,res,next)=>{
//   const userid=req.params.id;
//   const usertoken=req.params.token;

// const useremail = await User.findOne({_id:userid});
// if(!useremail)
// {
//  res.send('Invalid user-email...');
//  return
// }
// const secret=process.env.JWT_SECRET+useremail.password;
// console.log(secret);
// try{

//   const verify_token=jwt.verify(usertoken,secret);
// res.send({email:useremail.email});
// }catch(err){
//   res.status(400).send(err);
// }
// })

// app.post("/password-reset/:id/:token", async(req,res,next)=>{
//   const userid=req.params.id;
//   const usertoken=req.params.token;
//   const password = req.body.password;
//   const confirmpassword = req.body.confirmpassword;
// const useremail = await User.findOne({_id:userid});
// if(!useremail)
// {
//  res.send('Invalid user-email...');
//  return
// }
// const secret=process.env.JWT_SECRET+useremail.password;
// // console.log(secret);
// try{

//   const verify_token=jwt.verify(usertoken,secret);
// useremail.password=password;
// useremail.confirmpassword=confirmpassword;
// await password.save();
// await confirmpassword.save();
// res.send(useremail)

// }catch(err){
//   res.status(400).send(err);
// }
// })