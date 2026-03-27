class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = [], // Optional array to hold specific error details
        stack = ""
    ){
        super(message); // call the parent class constructor with the message 
        this.statusCode = statusCode;
        this.error = error;
        this.data = null; // Optional field to hold any additional data related to the error
        this.message = message;   //=> This is the error message that will be sent in the response
        this.success = false; // this indicates that the api call was not successfull


        //stack 
        if(stack){
            this.stack = stack; // If a custom stack trace is provided, use it; otherwise, capture the current stack trace
        } else {
            Error.captureStackTrace(this, this.constructor); // Capture the stack trace for this error instance
        }

    }
}

export {ApiError}; // Exporting the ApiError class so it can be used in other parts of the application

//Note : 
//this same template can be used in any project as it is a generic error handling class that can be extended or used directly to create and manage API errors in a consistent way across the application.