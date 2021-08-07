const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }, 
    photo:{
        data:Buffer,
        contentType:String
    },
    createdBy:{
        type: ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type:Date
     }
},{timestamps:true})

module.exports = mongoose.model("Post",postSchema)