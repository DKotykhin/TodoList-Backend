import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import path from 'path';
import favicon from 'serve-favicon';

import router from './router/router.js';
import errorHandler from "./error/errorHandler.js";

import 'dotenv/config';

mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('Mongoose DB connected...'))
    .catch((err) => console.log('DB Error:', err))

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

app.use('/api/upload', express.static('uploads'));
app.use('/api', router);
app.use(express.static(__dirname + '/src/public'));
app.use(favicon(path.join(__dirname, 'src/public', 'favicon.ico')))
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server has been started on port ${PORT}...`)
});