const express = require('express');
const router = express.Router();
const blog = require("../models/blogSchema");
const user = require("../models/userSchema");
const checkAuth = require("../middlewares/authToken");


const checkBlogOwnership = async (req, res, next) => {
    try{
        const blogEntry = await blog.findOne({_id:req.params.id});
        if(!blogEntry){
            return res.status(404).json({
                success: false,
                message: "Couldn't find entry for this blog"
            });
        }

        if(blogEntry.owner.toString() !== req.userId){
            return res.status(401).json({
                success: false,
                message: "User not matched with owner for this blog"
            });
        }

        req.blog = blogEntry;
        next();
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error in checking for owner for this blog"
        })
    }
} 

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

router.put("/:id",checkAuth,checkBlogOwnership,async (req,res)=>{
    try{
        const {title,desc,imageUrl,category} = req.body;
        const updatedBlog = await blog.findByIdAndUpdate( 
            req.params.id,
            {title,desc,imageUrl,category},
            {new:true});

        if(!updatedBlog){
            return res.status(404).json({
                success: false,
                message:"Couldn't update"
            });
        }
        
        res.status(200).json({
            success: true,
            message:"Updated successfully",
            updatedBlog
        });


    }
    catch(err){
        res.status(500).json({
            success: false,
            message:"Couldn't update blog"
        })
    }
})


router.delete("/delete/:id",checkAuth,checkBlogOwnership,async (req,res)=>{
    try{
        const deletedBlog = await blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({
                success:false,
                message:"blog not found"
            });
        }
        // const id  = deletedBlog.owner.toString();
        // console.log("user id ", id);
        const user_owner = await user.findById(req.userId);
        console.log("user " + user_owner);
        if (!user_owner) {
            return res.status(404).json({
                success:false,
                message: "User not found"
            });
        }

        const blogIndex = await user_owner.blogs.indexOf(req.params.id);
        if (blogIndex !== -1) {
            user_owner.blogs.splice(blogIndex, 1);
            await user_owner.save();
        }

        res.status(200).json({
            success:true,
            message: "Entry deleted successfully",
            data:deletedBlog
        });



    }
    catch(err){
        res.status(501).json({
            success:false,
            message: "Entry can't be deleted successfully",
            data: err
        });
    }
})






module.exports = router;