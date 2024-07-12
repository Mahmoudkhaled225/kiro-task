import path from "path";
import {fileURLToPath} from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import {config} from "dotenv";
config({path: path.join(__dirname,'../.env')});


import mongoose from 'mongoose';

// console.log(process.env.DB_local);


// const connectionDB = async () => {
//     return await mongoose
//         .connect(process.env.DB_local, )
//         .then(() => console.log("DB connection successful!"))
//         .catch((err) => console.log(err));
// };

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.DB_local);
        console.log("DB connection successful!");

        // Example: Insert a document to ensure the database and collection are created
        // const TestModel = mongoose.model('TestCollection', new mongoose.Schema({ name: String }));
        // await TestModel.create({ name: 'Test Entry' });
        //
        // console.log('Database and collection created with a test document.');
    } catch (err) {
        console.log(err);
    }
};

mongoose.set("strictQuery", true);
export default connectionDB;