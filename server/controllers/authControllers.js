const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bodyParser = require('body-parser');
const express = require('express');

const verifyToken = asyncHandler(async(req,res,next)=>{
    
    
    const token = req.header('Authorization');
    const tokenAfterBearer = token?.split(' ')[1];

    if(!tokenAfterBearer){
        return res.status(401).json({
            message:"No token provided!"
        })
    }
    else
    {
        try {

            const decodedToken = jwt.verify(tokenAfterBearer,process.env.JWT_SECRET);
             if (decodedToken) {
                req.user = decodedToken;
             

             
                next();

             }

        }
        catch(error){

            res.status(500).json({
                message:error.message

            })

        }
        
    }
    
})






const generateToken = (user) => {
    return jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
    },process.env.JWT_SECRET
    )  
}


module.exports = {
    verifyToken,
    generateToken
}