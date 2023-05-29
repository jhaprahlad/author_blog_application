const express = require("express");

const router = express.Router();

//importing model and controller files
const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");
const middleware1 = require("../middleware/middleware1");
const jwtMiddleware = require("../middleware/jwtMiddleware");

//-----------------------------creating API---------------------------//
router.post("/authors", authorController.createAuthor);

//login API
router.post(
    "/login",
    jwtMiddleware.verifyEmailPass,
    authorController.authorLogin
);
//creating API
router.post(
    "/blogs",
    middleware1.authorChecker,
    jwtMiddleware.verifytoken,
    blogController.createBlog
);

//get API
router.get(
    "/blogs",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    blogController.getBlogs
);
//update API
router.put(
    "/blogs/:blogId",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    jwtMiddleware.authorizedAuthor,
    blogController.updateBlogs
);

//--------------------------------------delete API---------------------------------------//
router.delete(
    "/blogs/:blogId",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    jwtMiddleware.authorizedAuthor,
    blogController.deleteBlog
);

router.delete(
    "/blogs",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    jwtMiddleware.authorizedAuthor,
    blogController.deleteBlogsByQuery
);

//------------------creating default API for get,post,put and delete request-------------//
router.use("*", function(req, res) {
        res.status(400).send("please send valid request")
    })

//--------------------exporting the router file--------------------------//
module.exports = router;