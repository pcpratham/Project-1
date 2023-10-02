const express = require('express');
const router = express.Router();
const user = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/test", (req,res)=>{
    res.status(200).json({
        success: true,
        message:"Testing Route"
    })
})

router.post("/register",async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name ||!email ||!password){
            return res.status(400).json({
                success: false,
                message:"Please enter all fields"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await user.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            success:true,
            message:"User registered successfully",
        });
    }
    catch(err){
        res.status(404).json({
            success: false,
            message:"Error while registering user",
            data:err
        });
    }
})

router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email ||!password){
            return res.status(400).json({
                success: false,
                message:"Please enter all fields"
            });
        }

        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(409).json({
                success: false,
                message:"No user found with this email"
            }); 
        }

        if(await bcrypt.compare(password,existingUser.password)){
            const token = jwt.sign({userId:existingUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
            res.cookie("authToken",token,{httpOnly:true});
            return res.status(200).json({
                success: true,
                message:"Logged in successfully",
                token,
                existingUser
            })
        }
        else{
            return res.status(409).json({
                success: false,
                message:"Incorrect password"
            });
        }
    }
    catch(err){
        res.status(404).json({
            success: false,
            message:"Error while registering user",
            data:err
        });
    }
})

module.exports = router;