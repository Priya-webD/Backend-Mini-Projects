//import { urlencoded } from 'express';
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

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


export const User = mongoose.model('User', userSchema);