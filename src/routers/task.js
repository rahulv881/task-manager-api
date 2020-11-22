const express = require('express');
const auth = require('../middleware/auth.js');

const router = new express.Router();
const Task = require("../models/task");

router.post("/tasks", auth, async (req, res) => {
  //console.log(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch {
    res.status(400).send();
  }
});

// GET Task /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
  try {
    //const task = await Task.find({ owner: req.user.id});

    let match = {};
    let sort = {};

    if(req.query.completed){
      match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy){
      const part = req.query.sortBy.split(':');
      sort[part[0]] = part[1] === 'desc' ? -1 : 1;
    }
    
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip : parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch(error){
    
    res.status(500).send();
  }
});


router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
    //const task = await Task.findOne({ _id, owner: req.user._id})

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", async (req, res) => {
  //const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const task = await Task.findById(req.params.id);
    updates.forEach( update => task[update] = req.body[update]);

    await task.save();
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
    console.log('Updated Successfully');
  } catch {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});
    if (!task) {
      return res.status(400).send({ error: "Task not found!" });
    }

    res.send(task);
  } catch {
    res.status(500).send();
  }
});


module.exports = router;