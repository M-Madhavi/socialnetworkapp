const express = require("express")
const router = express.Router()


const {getPostById,
    createPost,
    getPost,
    //photo,
    deletePost,
    getAllPosts,
    getAllUniqueUsers
} = require("../controllers/post")

const {isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//params
router.param("userId",getUserById)
router.param("postId",getPostById)


//create post route
router.post("/post/create/:userId",isSignedIn,isAuthenticated,createPost)


//read
router.get("/post/:postId",getPost)
//router.get("/post/photo/:postId",photo)//to get photo


//delete
router.delete("/post/:postId/:userId",
isSignedIn,
isAuthenticated,
deletePost
)


//listing route
router.get("/posts",getAllPosts)

router.get("/posts/createdBy",getAllUniqueUsers)

module.exports = router
