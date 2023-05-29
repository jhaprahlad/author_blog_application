const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const moment = require("moment")
let dateAndTime = moment().format('LLLL');

//----------------------------------creating blog---------------------------------------------------------//
const createBlog = async function(req, res) {
    try {
        let data = req.body
        if(data.isPublished== true){
            data.publishedAt = dateAndTime
        }
        if(data.isDeleted==true){
            return res.status(400).send({status:false,message:"cannot delete before creation"})
        }
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


//------------------------------geeting all the list of blog---------------------------------------------//
const getBlogs = async function(req, res) {
    try {
        let data = req.query;
        let { authorId, category, tags, subcategory } = data;
        let blogs = await blogModel.find({ $and: [{ isPublished: true }, { isDeleted: false }, data] })
        if (blogs.length < 1) {
            return res.status(404).send({ status: false, message: "No Blogs Found" })
        } else {
            return res.status(200).send({ status: true, message: "Blogs list", data: blogs })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

//-----------------------------------------updating the blog-----------------------------------------------------//

const updateBlogs = async function(req, res) {
    try {

        let data = req.body;
        if(Object.keys(data).length<1){
            return res.status(400).send({status:false,message:"cannot update without data"})
        }
        // console.log(data)
    
        let { title, body, tags, subcategory, isPublished, publishedAt,isDeleted } = data
        let blogId = req.params.blogId
        if(isDeleted==true){
            return res.status(400).send({status:false,message:"cannot delete while updating"})
        }
        if (isPublished == true) {
            publishedAt = dateAndTime
        } else if (isPublished == false) {
            publishedAt = null
        }
      
        
        let updateBlogs = await blogModel.findByIdAndUpdate(
            blogId, {
                $set: {
                    title: title,
                    body: body,
                    isPublished: isPublished,//always  true when anyone update the blogs
                    publishedAt: publishedAt//current date
                },
                $addToSet: {
                    tags: tags,
                    subcategory: subcategory
                }

            }, { new: true }
        )
        if (updateBlogs == null) {
                    return res.status(404).send({ status: false, message: "blog not found" })
                }
        else if (updateBlogs.isDeleted == false) {
            return res.status(200).send({ status: true, message: "Blog updated successfully", data: updateBlogs })
        } else if (updateBlogs.isDeleted == true) {
            return res.status(404).send({ status: false, message: "blog is not present" })

        }

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })

    }
}

//------------------------------------deleteting the blog---------------------//

const deleteBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: dateAndTime } }, { new: true })
        if (blog == null) {
            return res.status(404).send({ status: false, message: "blog not found" })
        }
        else {
            return res.status(200).send()
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteBlogsByQuery = async function (req, res) {
    try {
        let data = req.query

        let id = req.authorId

        let { category, authorId, tags, subcategory, isPublished } = data

        let deletedBlog = await blogModel.updateMany(
            {
                $and: [
                    { isDeleted: false }, { authorId: id }, data
                ]
            },
            { $set: { isDeleted: true, deletedAt: dateAndTime } }

        )
        if (deletedBlog.modifiedCount > 0) {
            return res.status(200).send({ status: true, message: `${deletedBlog.modifiedCount} blog deleted` })
        }
        else return res.status(404).send({ status: false, message: "no blogs found" })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

//exporting
module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogsByQuery = deleteBlogsByQuery