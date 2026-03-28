import ApiResponse from "../utils/api-response.js";


// importing the async handler to handle asynchronous operations in the controller
import asyncHandler from "../utils/async-handlers.js";

/*
const healthCheck = async (req, res, next) => {
    try{
        const user = await getUserFromDB() 
       res.status(200).json(
        new ApiResponse(200, {message: "Server is healthy"}));
    }catch(error){
        next(err); // Pass the error to the next middleware (error handler)
     }
}
*/

const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {message: "Server is healthy"}));
});
export { healthCheck };