const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
},{
    timestamps:true
});

module.exports = mongoose.model('blog',blogsSchema);