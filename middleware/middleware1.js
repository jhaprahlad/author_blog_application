const authorModel = require("../model/authorModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

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
      return res.status(500).send({status:true,message:true})
    }
}

module.exports.authorChecker = authorChecker
