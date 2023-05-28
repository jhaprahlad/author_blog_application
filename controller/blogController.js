const { cachedDataVersionTag } = require("v8")
const { updateMany } = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment")

let dateAndTime = moment().format('LLLL');

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let blog = await blogModel.create(data)
        return res.status(201).send({ "status": true, "data": blog })
    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}

module.exports.createBlog = createBlog
