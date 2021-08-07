const mongoose = require('mongoose')
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
uuidv4();

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength: 32,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    encry_password: {
        type: String,
      },
      salt: String,
      pic:{
        data:Buffer,
        contentType:String
  
    },
    aboutme:{
        type:String,
        trim:true
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    googleId: {
      type: String,
      required: true,
    },
    dp:{
        type:String,
        required:true,
    },
    createdAt: Date
},{timestamps:true})

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },


  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User",userSchema)