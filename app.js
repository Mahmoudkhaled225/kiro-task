import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
config({path: path.join(__dirname,'./.env')});


import express from 'express';
import xss from "xss";
import rateLimit from 'express-rate-limit';
import errorHandlerMW from "./middleware/errorHandlerMW.js";
import loadRoutes from './routes.js';



export const baseUrl = process.env.BASE_URL;

const app = express();
app.use(express.json({limit: process.env.Request_Size_Limit}));


// sanitize data Tags and Scripts
// app.use(xss());

const limiter = rateLimit({
    windowMs: parseInt(process.env.Rate_Limit_minutes, 10),
    max: parseInt(process.env.Rate_Limit_max, 10),
    message: 'Too many requests from this IP, please try again later',
});
// apply to all requests
// which is not good for production
// ,so we can apply to specific routes
// put for testing I will not apply it
// app.use(limiter)


// just entry points
app.get(`/`, (req, res) => {
    res.send(`Hello localhost`);
});


app.get(`${baseUrl}`, (req, res) => {
    res.send(`Hello ${baseUrl}`);
});


loadRoutes(app);

app.all("*", (req, res) => {
    // console.log(`In-valid Routing `+req.originalUrl);
    res.status(404).json({
        status: "Fail",
        message: `In-valid Routing `+req.originalUrl
    });
});

// error handler
app.use(errorHandlerMW);

export default app;