const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const mongoose = require('mongoose');
const jwt = reqiure('jsonwebtoken');


const userOneId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userOneId,
    name: "Saumy",
    email: "saumy@gmail.com",
    password: "saumy@123",
    tokens: [
           token: jwt.sign( {_id: userOneId}, process.env.JWT_SECRET)
    ]
}

// beforeEach( async () => {
//     await User.deleteMany();
//     await new User(userOne).save();
// });

// test('Should sign up a new user', async () =>{
//     await request(app).post('/users').send(userOne).expect(201);
// })

// test('Should login existing user', async() => {
//     await request(app).post('/users/login').send({
//         email: userOne.email,
//         password: userOne.password
//     }).expect(200);
// })

// test('Should not login non existent user', async () => {
//     await request(app).post('/users/login').send({
//         name: "Rahul",
//         email:"rahulv881@gmail.com",
//         password:"rahul@123"
//     }).expect(400);
// })

tets('Should get profile', async () => {
    await request('app').get('users/me').set('Authorizatoin', `Bearer $(userOne.tokens[0].token)`).send().expect(200)
})
