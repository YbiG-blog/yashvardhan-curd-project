const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../modelUser/User");

//Add a User
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      rollnum: req.body.rollnum,
      password: hashedPassword,
      phone: req.body.phone
    });

    const user = await newUser.save();
    res.status(200).json({
      message: "User successfully registered",
      id: user._id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// // get a user
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// // update a user
// router.put("/:id", async (req, res) => {
//   if (req.body.password) {
//     return res.status(500).json("You can't update your password");
//   } else {
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   }
// });
// // delete a user
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     res.status(200).json("Account has been deleted");
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// module.exports = router;