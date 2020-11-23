const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
 
const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
         fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Please provide PDF'));
        }
    }
})

app.post('/upload', upload.single('upload'), (req,res) => {
    res.send()
},(error, req, res, next) => {
    res.status(400).send({error: error.message});
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
