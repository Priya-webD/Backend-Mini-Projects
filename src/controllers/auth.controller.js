import {User} from "../models/user.models.js" // Importing the User model to interact with the user data in the database
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handlers.js";
import { ApiError } from "../utils/api-error.js";
import {sendEmail, emailVerificationMailgenContent} from "../utils/mail.js"; // Importing the sendEmail function and email helpers for verification

//above imports are for the user model, api response, async handler and api error handling


const generateAccessAndRefreshToken = async (userId) => {
    try{
         const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken() // Generate an access token for the user
        const refreshToken =  user.generateRefreshToken() // Generate a refresh token for the user

        user.refreshToken = refreshToken; // Set the refresh token in the user document
        await user.save({validateBeforeSave: false}); // Save the updated user document to the database

        return {accessToken, refreshToken}; // Return the generated access token and refresh token
    }catch(error){
        throw new ApiError(
            500,
         "Error in generating access and refresh token") 
         // If there is an error in generating the tokens, throw an error with a 500 status code and a message
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Implementation for registering a new user

    //data comes from the body, header or query parameters of the request

    const {email, username, password, role} = req.body; // Destructuring the email, username, password and role from the request body


   const existedUser = await User.findOne({
        $or: [{username}, {email}] // Check if a user with the same username or email already exists in the database

    })
    // If a user with the same username or email already exists, throw an error with a 400 status code and a message
    if(existedUser){
        throw new ApiError(400, "User with the same username or email already exists") 
        // If a user with the same username or email already exists, throw an error with a 400 status code and a message
    }
     //if user does not exist, create a new user in the database with the provided email, username, password and set isEmailVerified to false
    const user = await User.create({
        email,
        username,
        password, 
        isEmailVerified: false
    })

   const {unhashedtoken, hashedToken, tokenExpiry} =  
           user.generateTemporaryToken(); // generate a temporary token for email verification and set the token and its expiry time in the user document
    
           user.emailVerificationToken = hashedToken; // Set the email verification token in the user document
           user.emailVerificationTokenExpiry = tokenExpiry; // Set the email verification token expiry time in the user document

         await user.save({validateBeforeSave: false}); // Save the updated user document to the database


         await sendEmail({
            email: user.email, // Set the recipient's email address to the user's email
            subject: "Please verify your email", // Set the email subject to "Email Verification"
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                 `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedtoken}`
                ), // Generate the email content for email verification and pass the user's username and the verification URL with the unhashed token as parameters
         });

        const createdUser = await User.findById(user._id) // Find the user by their ID in the database
            .select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

        if (!createdUser) {
            throw new ApiError(500, "something went wrong while registering the user");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { user: createdUser }, // Return the created user data in the response
                    "User registered successfully" // Return a success message in the response
                )
            );
    }
);

export { registerUser };
