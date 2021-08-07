const User = require("../models/user");


//middleware to ge _id(userId)
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};
//get user
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};
//update user
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

//get all users
exports.getAllUsers = (req,res) =>{
    User.find().exec((err,users) => {
     if(err || !users){
         return res.status(400).json({
             error :"No Users in DB"
         })
     }
     res.json({users})
    })
}

//delete user

exports.deleteUserById = (req, res,next) => {
    User.findOneAndDelete({_id: req.profile._id})
        .exec((err,user) =>{
            if(err || !user){
                return res.status(400).json({
                    error:"No user in DB to delete"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.status(200).json({
              message:"User Deleted"
            })

        })

};
//follow user
exports.followUser = async(req,res) => {
  if (req.body.followId !== req.params.userId) {
    try {
      const currentUser = await User.findById(req.params.userId);
      const user = await User.findById(req.body.followId);
      if (!currentUser.followings.includes(req.body.followId)) {
        await currentUser.updateOne({ $push: { followings: req.body.followId } });
        await user.updateOne({ $push: { followers: req.params.userId } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }

}

//unfollow user
exports.unfollowUser = async(req,res) => {
  if (req.body.unfollowId !== req.params.userId) {
    try {
      const currentUser = await User.findById(req.params.userId);
      const user = await User.findById(req.body.unfollowId);
      if (currentUser.followings.includes(req.body.unfollowId)) {
        await currentUser.updateOne({ $pull: { followings: req.body.unfollowId } });
        await user.updateOne({ $pull: { followers: req.params.userId } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you don't follow this user");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }

}



    
 