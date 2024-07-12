import joi from "joi";
import {generalFields} from "../../middleware/validation.js";



export const signUpValidation = joi.object({
    fullName: joi.string().min(2).max(32).required(),
    email: generalFields.email,
    password: generalFields.password,
    confirmationPassword: generalFields.confirmationPassword,
    phone:generalFields.phone,
    file: generalFields.file,
});



export const confirmEmailValidation = joi.object({
    token : joi.string().required()
});

export const loginValidation = joi.object({
    email: generalFields.email,
    password: generalFields.password,
});
