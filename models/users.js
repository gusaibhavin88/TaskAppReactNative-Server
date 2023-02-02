import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "password should have 8 character"],
      select: false, //this will not show password in controller 
    },
    avatar: {
      public_id: String,
      url: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    task: {
      title: String,
      description: String,
      completed: Boolean,
      createdAt: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    otp: Number,
    otp_expiry: Date,
  }

);

userSchema.pre("save" , async function (next){
if(!this.isModified("password")) return next() //we use ismodified in case it is updated
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(this.password , salt)    //this is for verification functionality
this.password = hashedPassword
next()
})

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET,
   {expiresIn: process.env.JWT_COOKIE_EXPIRE *24* 60 * 60 * 1000});   //this for registeration
};

userSchema.methods.comparePassword = async function (password) {     //this is for login functionality
    return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User", userSchema);
