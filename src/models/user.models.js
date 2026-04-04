//import { urlencoded } from 'express';
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({

    avtar: {
        URL: { type: String, default: "" },
        localPath: { type: String, default: "" }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpiry: {
        type: Date,
    }
}, { timestamps: true });


//adding encryption to password
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next(); //if password is not modified then move to next middleware

    this.password = await bcrypt.hash(this.password, 10); //hash the password with salt rounds of 10
    next();
})


//verifying the password 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);//compare the provided password with the hashed password in the database
};

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateTemporaryToken = function() {
    const unhashedtoken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256") //hash the token using sha256 algorithm
        .update(unhashedtoken) //update the hash with the unhashed token
        .digest("hex"); //get the hashed token in hexadecimal format

        const tokenExpiry = Date.now() + (20*60*1000); //set the token expiry time to 20 minutes from now

    return { unhashedtoken, hashedToken, tokenExpiry};
}


export const User = mongoose.model('User', userSchema);