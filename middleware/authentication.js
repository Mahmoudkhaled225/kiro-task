import AppError from "../utils/ErrorHandling/AppError.js";
import {decodedToken} from "../utils/Token/decodedToken.js";
import {getUserById} from "../helpers/userService.js";

const authentication = () => {
    return async (req, res, next) => {
        const { Authorization } = req.headers;
        if(!Authorization)
            return next( new AppError("please enter a valid token in Authorization property" , 404));
        if (!Authorization.startsWith(process.env.TOKEN_PREFIX))
            return next(new AppError("please enter a valid token's prefix" , 404));
        const token = Authorization.split(process.env.TOKEN_PREFIX)[1];
        const decode = decodedToken(token);
        if (!decode || !decode.id)
            return next(new AppError("in-valid token" , 400));
        const user = await getUserById(decode.id);
        if (!user)
            return next(new AppError("not authorized" , 403));
        req.user = user;
        next();
    };
};
export default authentication;