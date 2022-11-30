import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { registerUserValidation, loginUserValidation, updateUserValidation, taskCreateValidation, taskUpdateValidation } from './validations/validation.js';
import { userLogin, userRegister, userDelete, userLoginByToken, userUpdate } from "./controllers/userController.js";
import { createTask, deleteTask, getAllTasks, updateTask } from "./controllers/taskController.js";
import { uploadImage } from './controllers/uploadController.js';
import { validationErrors, checkAuth, multerUpload } from './utils/index.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('Mongoose DB connected...'))
    .catch((err) => console.log('DB Error:', err))

const app = express();
app.use(express.json());
app.use('/api/upload', express.static('uploads'));

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>')
// });

app.post('/api/upload', checkAuth, multerUpload(), uploadImage);

app.get('/api/user/loginbytoken', checkAuth, userLoginByToken);
app.post('/api/user/login', loginUserValidation, validationErrors, userLogin);
app.post('/api/user/register', registerUserValidation, validationErrors, userRegister);
app.delete('/api/user/delete', checkAuth, userDelete);
app.patch('/api/user/update', checkAuth, updateUserValidation, validationErrors, userUpdate);

app.get('/api/task/getall', checkAuth, getAllTasks);
app.post('/api/task/create', checkAuth, taskCreateValidation, validationErrors, createTask);
app.delete('/api/task/delete', checkAuth, deleteTask);
app.patch('/api/task/update', checkAuth, taskUpdateValidation, validationErrors, updateTask);

const PORT = process.env.PORT || 4001;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server has been started on port ${PORT}...`)
})