const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  deleteUserById,
  followUser,
  unfollowUser
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

//get routes
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/",getAllUsers)
//update
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.delete("/:userId",isSignedIn,isAuthenticated,deleteUserById)
//follow and unfollow routes
router.put("/:userId/follow",isSignedIn,followUser)
router.put("/:userId/unfollow",isSignedIn,unfollowUser)


module.exports = router;
