import {Router} from "express";
import * as authController from "./authController.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import {fileUpload} from "../../services/multer.js";
import {validation} from "../../middleware/validation.js";
import * as validators from "./authValidation.js";


const authRouter = Router();


authRouter.post("/signup",
    fileUpload({}).single("IdImage"),
    validation(validators.signUpValidation),
    asyncHandler(authController.signUp));

authRouter.get("/confirmEmail/:token",
    validation(validators.confirmEmailValidation),
    asyncHandler(authController.confirmEmail));


authRouter.post("/login",
    validation(validators.loginValidation),
    asyncHandler(authController.logIn));



export default authRouter;

