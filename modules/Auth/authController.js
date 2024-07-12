import {getConfirmedUserByEmail, getUserByEmail, getUserById, updateConfirmed} from "../../helpers/userService.js";
import {hashPassword} from "../../utils/Hashing/hashPassword.js";
import userModel from "../../DB/models/userModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import cloudinary from "../../services/cloudinary.js";
import {createToken} from "../../utils/Token/createToken.js";
import {decodedToken} from "../../utils/Token/decodedToken.js";
import sendEmail from "../../services/sendMail.js";
import {compareHashedPassword} from "../../utils/Hashing/compareHashedPassword.js";


const createUser = async (req, hashedPassword) => {
    const { fullName, email, phone } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Users`
    });

    return await userModel.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        IdImage: {
            path: secure_url,
            publicId: public_id
        }
    });
};

// Function to send confirmation email
async function sendConfirmationEmail(userEmail, confirmationLink) {
    const emailSent = await sendEmail({
        to: userEmail,
        message: `<a href=${confirmationLink}>Click to confirm</a>`,
        subject: "Confirmation Password"
    });

    if (!emailSent)
        throw new AppError("Sign up failed, we could not send the email. Please try again", 400);
}


/**
 * Handles the user signup process, including user creation, password hashing, and sending a confirmation email.
 *
 * @param {Object} req - The request object from Express.js containing the user's signup data.
 * @param {Object} res - The response object from Express.js used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the Express.js route's middleware stack.
 *
 * @returns {Promise<void>} - A promise that resolves when the signup process is complete. If the process fails,
 *                             the promise will reject with an error, which is handled by passing it to the `next` function.
 *
 * @description This function performs several steps as part of the signup process:
 *              1. Checks if the user's email already exists in the database. If it does, an error is returned.
 *              2. Hashes the user's password using bcrypt.
 *              3. Creates a new user record in the database with the provided information and the hashed password.
 *              4. Generates a token for email confirmation.
 *              5. Constructs a confirmation link using the generated token.
 *              6. Sends a confirmation email to the user with the confirmation link.
 *              7. Returns a success message indicating that the user should check their email to confirm their account.
 *
 *              If any of these steps fail, an appropriate error is returned using the `next` function with an `AppError` instance.
 */
export const signUp = async (req, res,next) => {
    const {email} = req.body;
    if(await getUserByEmail(email))
        return next(new AppError("email already exist so login", 400));

    const hashedPassword = await hashPassword(req.body.password);
    const user = await createUser(req, hashedPassword);

    const token = createToken(user._id);
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmEmail/${token}`;

    await sendConfirmationEmail(user.email, confirmationLink);

    return res.status(200).json({"message": "check your email to confirm your account"});
};

/**
 * Confirms a user's email address based on a provided token.
 *
 * @param {Object} req - The request object, which includes the token as a URL parameter.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the Express.js route's middleware stack.
 *
 * @property {string} req.params.token - The token provided in the URL parameter used for confirming the user's email.
 *
 * @returns {Promise<void>} - A promise that resolves when the email confirmation process is complete. If the process fails,
 *                             the promise will reject with an error, which is handled by passing it to the `next` function.
 *
 * @description This function performs the following steps to confirm a user's email:
 *              1. Decodes the provided token to extract the user ID.
 *              2. Validates the decoded token to ensure it contains a valid user ID.
 *              3. Fetches the user from the database using the decoded user ID.
 *              4. Checks if the user already has their email confirmed. If so, returns an error.
 *              5. Updates the user's status to mark their email as confirmed.
 *              6. Returns a success message indicating the user's email has been confirmed.
 *
 *              If any of these steps fail, an appropriate error is returned using the `next` function with an `AppError` instance.
 */
export const confirmEmail = async (req, res, next) => {
    const {token} = req.params;
    const decode = decodedToken(token);
    if (!decode?.id)
        return next(new AppError("in-valid token", 400));

    const user = await getUserById(decode.id);
    if(!user)
        return next(new AppError("user not found", 404));
    if(user.confirmed)
        return next(new AppError("user already confirmed so logIn", 400));

    await updateConfirmed(user._id);

    return res.status(201).json({message: "you are confirmed now you can login"});
};



/**
 * Authenticates a user by their email and password, generates a token upon successful authentication.
 *
 * @param {Object} req - The request object from Express.js containing the user's login credentials.
 * @param {Object} res - The response object from Express.js used to send back the HTTP response.
 * @param {Function} next - The next middleware function in the Express.js route's middleware stack.
 *
 * @property {string} req.body.email - The email address provided by the user for login.
 * @property {string} req.body.password - The password provided by the user for login.
 *
 * @returns {Promise<void>} - A promise that resolves when the login process is complete. If the process fails,
 *                             the promise will reject with an error, which is handled by passing it to the `next` function.
 *
 * @description This function performs the following steps to authenticate a user:
 *              1. Fetches the user from the database using the provided email.
 *              2. If the user is not found, returns a "user not found" error.
 *              3. Checks if the user's email has been confirmed. If not, returns a "user not confirmed" error.
 *              4. Compares the provided password with the hashed password stored in the database.
 *              5. If the password does not match, returns a "password not match" error.
 *              6. Generates a token for the user upon successful authentication.
 *              7. Returns a success message along with the generated token.
 *
 *              Note: For testing purposes, this function explicitly informs the user if the email is not found or the password does not match.
 *                    In a production environment, it is recommended to use a generic error message for security reasons.
 */
export const logIn = async (req, res, next) => {
    const {email, password} = req.body;
    const user = await getConfirmedUserByEmail(email);

    /// in production we should not tell the user if the email is not found or the password is not match
    // but here just for testing purpose we will tell the user if the email is not found or the password is not match
    if(!user)
        return next(new AppError("user not found", 404));
    if(!user.confirmed)
        return next(new AppError("user not confirmed", 400));

    const isMatch = await compareHashedPassword(password,user.password);
    if(!isMatch)
        return next(new AppError("password not match", 400));

    const token = createToken(user._id);
    return res.status(200).json({"message": "login success", token});
}