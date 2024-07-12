import nodemailer from "nodemailer";

import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
config({path: path.join(__dirname,'./../.env')});



const sendEmail = async ({ to = "", message = "", subject = "" }) => {
    let transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587, // 465,
        secure: false,
        service: "gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS,
        },
    });
    let info = await transporter.sendMail({from: process.env.SENDER_EMAIL,to,subject, html: message,});
    if(info.accepted.length)
        return true;
    return false;
};

export default sendEmail;