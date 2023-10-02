const express = require('express');
const router = express.Router();
const blog = require("../models/blogSchema");
const user = require("../models/userSchema");
const checkAuth = require("../middlewares/authToken");


router.post("/addBlog",checkAuth,async (req,res)=>{
    try{
        const {title,desc,imageUrl,category} = req.body;
        if(!title||!desc||!imageUrl||!category){
            res.status(401).json({
                success: false,
                message:"Enter all details carefully!!"
            });
        }

        const blogEntry = await blog.create({title,desc,imageUrl,category,owner:req.userId});

        //user ke blog array me dalna hai
        const userEntry = await user.findOne({_id:req.userId});
        if(!userEntry){
            return res.status(404).json({
                success:false,
                message:"User not found",
                blogEntry
            });
        }


        userEntry.blogs.push(blogEntry._id);
        await userEntry.save();
        res.status(200).json({
            success:true,
            message:"Entry saved successfully",
            blogEntry,
            userEntry
        })
    }
    catch(err){
        res.status(404).json({
            success: false,
            message:"Error while creating blog"
        });
    }
});





module.exports = router;