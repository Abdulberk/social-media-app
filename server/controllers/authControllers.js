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

        
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(403).json({
                    message:"Token expired!",
                })
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    message:"Invalid token!"
                })
            }

            return res.status(500).json({
                message: error.message
            })

        }
        
    }
    
})

const verifyRefreshToken = asyncHandler(async(req,res,next)=>{
    const refreshToken = req.body.refreshToken;

    if(!refreshToken){ return res.status(401).json({message:"No refresh token provided!"})}

    try {
        const decodedRefreshToken = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
        if (decodedRefreshToken) {
            req.user = decodedRefreshToken;
            next();
        }



    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({
                message:"Refresh token expired!",




            })
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message:"Invalid refresh token!",
            


            })
        }

        return res.status(500).json({
            message: error.message

        })
    }


})

const generateRefreshToken = (user) => {
    return jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
        },process.env.JWT_REFRESH_SECRET,{
            expiresIn: process.env.JWT_REFRESH_EXPIRATION
            }
            )
}


const generateAccessToken = (user) => {
    return jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
    },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_ACCESS_EXPIRATION
    }
    )  
}


module.exports = {
    verifyToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}