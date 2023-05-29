const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const jwt = require("jsonwebtoken")
const validator = require("validator")

// creating middleware for verifying emailId and passeord while login 
const verifyEmailPass = async function (req, res, next) {
    try {
        let data = req.body
        let { email, password } = data;
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "email and password are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({ status: false, message: "email is invalid" })
        }




        let author = await authorModel.findOne({ email: email, password: password })
        if (!author) {
            return res.status(400).send({ status: false, message: "email or password is incorrect" })
        }
        let authorId = author._id
        req.authorId = authorId
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//creating middleware for verifying header Token 
const verifytoken = async function (req, res, next) {
    try {
        let token = req.header("x-api-key")
        if (!token) {
            return res.status(401).send({ status: false, message: "required token is missing (first login)" })
        }
        let decoded = jwt.verify(token, "Prahlad_Rohit_Sofiyan_Saurabh_Secret_Key")
        if (!decoded) {
            return res.status(401).send({ status: false, message: "invalid token" })
        }
        req.authorId = decoded.authorId
        next()
    }
    catch (err) {
        if (err.message.includes("signature") || err.message.includes("token") || err.message.includes("malformed")) {

            // console.log(err.message)
            return res.status(401).send({ status: false, message: "You are not Authenticated" })
        }
        return res.status(500).send({ status: false, message: err.message })
    }
}

//creating middleware for authorization
const authorizedAuthor = async function (req, res, next) {
    try {
        let id = req.authorId
        let blogId = req.params.blogId;
        if (blogId) {
            let blog = await blogModel.findById(blogId)
            if (!blog) {
                return res.status(404).send({ status: false, message: "blog not found" })
            }
            let authorId = blog.authorId
            if (id != authorId) {
                return res.status(403).send({ status: false, message: "You are not authorized" })
            }
        }
        let authorId = req.query.authorId
        if (authorId) {
            if (id != authorId) {
                return res.status(403).send({ status: false, message: "You are not authorized" })
            }
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

//exporting 
module.exports.verifyEmailPass = verifyEmailPass
module.exports.verifytoken = verifytoken
module.exports.authorizedAuthor = authorizedAuthor
