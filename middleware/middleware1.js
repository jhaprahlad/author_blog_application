const authorModel = require("../model/authorModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

// creating middleware for verifying ID form req.body
const authorChecker = async function (req, res, next) {
    try {
        let id = req.body.authorId
        if (id && !ObjectId.isValid(id)) {
            return res.status(400).send({status:false,message:"authorId is invalid"})
        }
        if(!id){
            return res.status(400).send({status:false,message:"authorId is required"})
        }
        let author = await authorModel.findById(id)
        if (!author) {
            return res.status(400).send({ status: false, message: "there is no author with this author id" })
        }
        next()
    } catch (error) {
      return res.status(500).send({status:false,message:error.message})
    }
}
// creating middleware for verifying ID from req.params as well as req.query
const verifyId = async function (req, res, next) {
    try {
        let authorId = req.query.authorId
        let blogId = req.params.blogId
        let id=blogId || authorId
        
        if (id && !ObjectId.isValid(id)) {
            return res.status(400).send({status:true,message:"Please enter a valid id"})
        }
        next()
    } catch (error) {
       return res.status(500).send({status :false,message:error.message})
    }
}

//exporting 
module.exports.authorChecker = authorChecker
module.exports.verifyId = verifyId