const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function (req,res,next){

    //console.log("Inside auth");
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        //console.log(token);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        const user = await User.findOne({
          _id: decoded._id,
          "tokens.token": token,
        });

        if(!user){
            return res.status(404).send('Please Authenticate!');
        }

        req.token = token;
        req.user = user;
        next();

    }catch(error){
        console.log(error);
        res.status(401).send('error: Authorization Error');
    }   
}

module.exports = auth;