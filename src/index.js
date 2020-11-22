const express = require("express");
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

require("./db/mongoose");

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// app.use( (req,res,next) => {
//   res.status(503).send('Service is under maintainance, Pleaes try later');
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server running on port " + port);
});

const Task = require('./models/task');
const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("5fb7ef68d0d665077ab70b33");
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById("5fb7ee939e027d063d59b6db");
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
// }

// main();