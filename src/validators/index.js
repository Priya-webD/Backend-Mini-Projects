import {body} from "express-validator";

//validation rules for user registration
const userRegisterValidator = () => {
    return [
        body.apply("email")
          .trim()
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email is invalid"),
        body("username")
          .trim()
          .notEmpty()
          .withMessage("Username is required")
          .isLength({min: 3, max: 20})
          .withMessage("Username must be between 3 and 20 characters")
          .toLowerCase() 
          .withMessage("Username must be in lowercase"),
        body("password")
          .trim()
          .notEmpty()
          .withMessage("Password is required")
          .isLength({min: 6})
          .withMessage("Password must be at least 6 characters"),
        body("fullname")
          .trim()
          .optional()
    ]
}

//login validator 
const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
  ];
};


export { userRegisterValidator, userLoginValidator };