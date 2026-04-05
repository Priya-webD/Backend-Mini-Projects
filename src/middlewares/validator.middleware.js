import {validationResult} from 'express-validator';

import {ApiError} from '../utils/api-error.js';

//middleware  to validate the request body, query parameters or headers based on the validation rules defined in the route handlers
export const validate = (req, res, next) => {
    const errors = validatonRequest(req); //get the validation errors from the request object 

    if(errors.isEmpty()){
        return next(); // if there are no validation errors, proceed to next middleware or route handler 
    }

    const extractedErrors = []; //array to store the extracted validation errors 

    errors.array().map((err) => 
          extractedErrors.push({[err.path]: err.mesg})); // extract the validation error and push them to the extractedErrors array

    throw new ApiError(422, "Recieved data is not valid", extractedErrors); //if there are validation errors, 
    // throw an error with a 422 status code and a message along with the extracted validation errors

}