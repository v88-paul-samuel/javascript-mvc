import { body } from "express-validator";

export default {
    login: [
        body("email_address").trim().notEmpty().withMessage("Email Address is required")
            .isEmail().withMessage("Must be a valid Email").normalizeEmail().escape(),
        body("password").trim().isLength({min:3}).withMessage("Password is minimum of 3 characters").escape(),
    ],
    register: [
        body("first_name").trim().notEmpty().withMessage("First Name is required").escape(),
        body("last_name").trim().notEmpty().withMessage("Last Name is required").escape(),
        body("email_address").trim().notEmpty().withMessage("Email address is required")
            .isEmail().withMessage("Must be a valid Email").normalizeEmail().escape(),
        body("password").trim().isLength({min:3}).withMessage("Password is minimum of 3 characters").escape()
    ],
    post_message: [
        body("message").trim().notEmpty().withMessage("Messages must not be empty or blank spaces").escape()
    ],
    post_comment: [
        body("comment").trim().notEmpty().withMessage("Comments must not be empty or blank spaces").escape()
    ]
};