import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
import jwt from "jsonwebtoken";
config({path: path.join(__dirname,'./../../.env')});


export const createToken = (id/*payload = {}*/) => {
    // if (!Object.keys(payload).length)
    //     return false;
    return jwt.sign({id}, process.env.TOKEN_SIGNATURE,
        {expiresIn: process.env.TOKEN_EXPIRE} );
};
