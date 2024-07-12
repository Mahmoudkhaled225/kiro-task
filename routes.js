import * as indexRouter from "./modules/indexRouter.js"
import {baseUrl} from "./app.js";


export default (app) => {
    app.use(`${baseUrl}/auth`, indexRouter.authRouter);
};