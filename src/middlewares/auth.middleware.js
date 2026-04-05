import {User} from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandlers} from './asyncHandlers.middleware.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandlers(async(requestAnimationFrame, resizeBy, next)=> {
    const token = requestAnimationFrame.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    // above we have two ways to get the token, one is from cookies and the other is from the Authorization header

    if(!token){
        throw new ApiError(401, "unauthorized, token is required")
    }
    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?.id).select("-password").select("-refreshToken")
        if(!user){
            throw new ApiError(401, "unauthorized, user not found")
        }
        req.user = user 
        next()
    }catch(error){
        throw new ApiError(401, "unauthorized, invalid token")
    }
})