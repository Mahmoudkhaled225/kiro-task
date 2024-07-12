import jwt from "jsonwebtoken";
import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
config({path: path.join(__dirname,'./../../.env')});

export const decodedToken = (payload = "") => {
    if (!payload)
        return false;
    return jwt.verify(payload, process.env.TOKEN_SIGNATURE);

};