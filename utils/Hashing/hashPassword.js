import bcrypt from "bcryptjs";
import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
config({path: path.join(__dirname,'./../../.env')});



export const hashPassword = async (pass) => {
    return await bcrypt.hash(pass, +process.env.SALT_ROUNDS);
};

