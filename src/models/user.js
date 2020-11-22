const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const { deleteMany } = require('./task');

const userSchema = new mongoose.Schema( {
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    required: false,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value){
          if(value.toLowerCase().includes('password')){
            throw new Error("Password is too common, Please try another")
          }
      }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
},{
  timestamps: true
});


userSchema.virtual('tasks',{
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email,password) => {
  //console.log("Inside Credentials");
  const user = await User.findOne({email});

  if(!user){
    throw new Error('Unable to find user');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    //console.log("password: ", password);
    //console.log("user.password: ", user.password);
    //console.log("isMatch: ", isMatch);

    if(!isMatch){
      throw new Error('Unable to login');
    }
    
    return user;
};

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  // console.log(user);
  const token = jwt.sign({ _id: user._id.toString() }, "cisco");

  user.tokens = user.tokens.concat({token});
  await user.save();
  // console.log(user);
  //console.log(user.tokens);

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

//Hashing the plain test password
userSchema.pre('save', async function(next){
  const user = this;

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }

  console.log('Just Before!');
  next();
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {

  const user = this;
  await Task.deleteMany({owner: user._id}); 


  next();
})

const User = mongoose.model("User", userSchema);

// const me = User({
//   name: "   Rahul   ",
//   age: 21,
//   email: "rahulv881@gmail.com",
//   password: '   pass  '
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error!", error);
//   });

module.exports = User;
