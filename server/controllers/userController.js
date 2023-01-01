const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt')
const {generateAccessToken, generateRefreshToken} = require('./authControllers')
const joi = require('joi')


const bodyParser = require("body-parser");
const express = require('express');

const loginSchema = joi.object({
    email:joi.string().email().required().min(6).max(255),
    password:joi.string().required().min(4).max(255)
})
const registerSchema = joi.object({
    username:joi.string().required().min(6).max(30),
    email:joi.string().email().required().min(6).max(255),
    password:joi.string().required().min(4).max(255)
})


const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");

  }
  const salt = await bcrypt.genSalt(10);
  const encodedPassword = await bcrypt.hash(password, salt)



  await User.create({
    username: username,
    password: encodedPassword,
    email: email,
    isAdmin: false,


  })
    .then((user) => {
      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
        
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

const getOneUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .then((user) => {
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err.message,
      });
    });
});

  
const userLogin = asyncHandler(async(req,res)=>{
 
  const {email,password} = req.body;
  const {error} = await loginSchema.validateAsync(req.body);



  if(error){
      return res.status(400).json({
          message:error.details[0].message
      })
     
  }
  
  try {
    const user = await User.findOne({email})


    if (!user) {return res.status(404).json({message: "User not found"}) }
    const passMatches = await bcrypt.compare(password,user.password);

    if (passMatches) {
    
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)


      res.status(200).json({
        message: "Login successful",
        user: user.username,
        isAdmin: token.isAdmin,
        accessToken: accessToken,
        refreshToken: refreshToken,




      })
    }
    else{
      return res.status(401).json({
        message: "User or password is incorrect"
      })
    }

    

  }
  catch(err){
    return res.status(500).json({
      message: err.message
    })

  }

})

module.exports = {
  registerUser,
  getOneUser,
  userLogin
};
