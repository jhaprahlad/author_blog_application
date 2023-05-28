const express = require("express");

const router = express.Router();

const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");

const middleware1 = require("../middleware/middleware1");
const jwtMiddleware = require("../middleware/jwtMiddleware");

//-----------------------------creating API---------------------------//

router.post("/authors", authorController.createAuthor);

router.post(
    "/blogs",
    middleware1.authorChecker,
    jwtMiddleware.verifytoken,
    blogController.createBlog
);

router.get(
    "/blogs",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    blogController.getBlogs
);

router.put(
    "/blogs/:blogId",
    middleware1.verifyId,
    jwtMiddleware.verifytoken,
    jwtMiddleware.authorizedAuthor,
    blogController.updateBlogs
);


//------------------creating default API for get,post,put and delete request-------------//
router.use("*", function(req, res) {
        res.status(400).send("please send valid request")
    })
    //--------------------exporting the router file--------------------------//
module.exports = router;