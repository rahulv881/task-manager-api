const express = require("express");

const { update } = require("../models/user");
const auth = require('../middleware/auth');
const User = require("../models/user");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");
const router = new express.Router();

router.post("/users", async (req, res) => {
  console.log(req.body);

  try {
    const user = new User(req.body);

    await user.save();
    sendWelcomeEmail(user.email,user.name);

    res.status(201).send(user);
    console.log("Sent Successfully!");
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {

  res.send(req.user);
  // const users = await User.find({});
  // try {
  //   res.send(users);
  // } catch (error) {
  //   res.status(500).send(error);
  // }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(req.params);

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

   try {
     const user = req.user;
     updates.forEach((update) => {
       user[update] = req.body[update];
     });
    
    await user.save();
    res.send(user);
    console.log("Updated Successfully");
   } catch (error){
     res.status(400).send({error: error});
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(400).send({ error: "Users not found!" });
    // }

    await req.user.remove();

    sendCancelEmail(req.user.email,req.user.name);
    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

router.get("/test", (req, res) => {
  res.send("Testing!");
});

router.post("/users/login",async (req,res) => {
  try{
    const user = await User.findByCredentials(req.body.email,req.body.password);
    //console.log(user);
    const token = await user.generateAuthToken();

    res.send({user,token});
  }catch(error){
    console.log(error);
    res.status(400).send();
  }
})

router.post("/users/logout", auth, async (req,res,next) => {

  //console.log('gotcha0');
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token;
    })
    await req.user.save();
    res.send();
  }catch(error){
    console.log(error);
    res.status(500).send(error);
  }

})

router.post("/users/logoutAll", auth, async (req,res,next) => {

  try{
    req.user.tokens = [];
    await req.user.save();

    res.send();
  }catch(error){
    res.status(500).send(error);
  }
  
})

module.exports = router;
