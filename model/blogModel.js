const mongoose = require("mongoose") //importing mongoose 

const blogSchema = new mongoose.Schema({ //creting a Schema for blog model
    title:{
        type:String,
        minLength:[2,"minimun length of title should be 2 characters"],
        required:[true, "title is required"],
        trim:true
    },

    body:{
        type:String,
        minLength:[10,"minimun length of body should be 10 characters"],
        required:[true, "body is required"],
        trim:true
    },

    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Author",
        required:[true, "authorId is required"]       
    },

    tags:[String],

    category:{
        type:String,
        required:[true, "category is required"],
        trim:true
    },

    subcategory:[String],

    deletedAt:{
        type:Date,
        default:null
    },

    publishedAt:{
        type:Date,
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false    
    },
    
    isPublished:{
        type:Boolean,
        default:false   
    }   
},{timestamps:true})

module.exports = mongoose.model("Blog",blogSchema)  //exporting blog model



//{ title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, category: {string, mandatory}, subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}