const express = require('express');
const { verifyToken } = require('../controllers/authControllers');
const notController = require('../controllers/notControllers');


const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:id',verifyToken, userController.getOneUser);

 router.post('/register', userController.registerUser); 

    router.get('/users',(req,res)=>{
        res.json({message:"all users retrieved"})
    }
    )

    router.delete('/users/:id',(req,res)=>{
        res.json({message:"specified user deleted"})
    }
    )

    router.put('/users/:id',(req,res)=>{
        res.json({message:"specified user updated"})
    }
    )
    router.post('/login',userController.userLogin,(req,res)=>{
        res.json({message:"user logged in: "+ req.user.id})
        })


        router.post('/follow-user/:id',verifyToken,notController.followUser);

        


    module.exports = router;
