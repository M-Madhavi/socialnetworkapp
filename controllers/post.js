const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const User = require("../models/user")


exports.getPostById = (req, res, next, id) => {
  Post.findById(id)
    .populate("createdBy")
    .exec((err, post) => {
      if (err) {
        return res.status(400).json({
          error: "post not found"
        });
      }
      req.post = post;
      next();
    });
};

exports.createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //use form data in postman to fill the fields
      const { title, text, createdBy } = fields;
  
      if (!title || !text || !createdBy) {
        return res.status(400).json({
          error: "Please include all fields"
        });
      }
  
      let post = new Post(fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        post.photo.data = fs.readFileSync(file.photo.path);
        post.photo.contentType = file.photo.type;
      }
      
  
      //saving post to the DB
      post.save((err, post) => {
        if (err) {
          res.status(400).json({
            error: "Saving post in DB failed"
          });
        }
        res.json(post);
      });
    });
  };
  //get the post
exports.getPost = (req, res) => {
  req.post.photo = undefined;
  return res.json(req.post);
};
//middleware runs in the BG 

//middleware
exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
  }
  next();
};

// delete controllers
exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the post"
      });
    }
    res.json({
      message: "Deleted post successfully!",
      //deletedPost
    });
  });
};


//post listing

exports.getAllPosts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Post.find()
    .select("-photo")
   // .populate("createdBy")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "NO posts FOUND"
        });
      }
      res.json(posts);
    });
};

//get all the unique users who uses the app
exports.getAllUniqueUsers = (req, res) => {
  Post.distinct("createdBy", {}, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "NO user found"
      });
    }
    res.json(user);
  });
};

