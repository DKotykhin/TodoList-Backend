import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import multer from 'multer'

import { registerUserValidation, loginUserValidation, updateUserValidation, taskCreateValidation, taskUpdateValidation } from './validations/validation.js';
import { userLogin, userRegister, userDelete, userLoginByToken, userUpdate } from "./controllers/userController.js";
import { createTask, deleteTask, getAllTasks, updateTask } from "./controllers/taskController.js";
import { uploadImage } from './controllers/uploadController.js'

dotenv.config();

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('Mongoose DB connected...'))
    .catch((err) => console.log('DB Error:', err))

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage })

app.post('/api/upload', upload.single('image'), uploadImage)

app.get('/api/user/loginbytoken', userLoginByToken);
app.post('/api/user/login', loginUserValidation, userLogin);
app.post('/api/user/register', registerUserValidation, userRegister);
app.delete('/api/user/delete', userDelete);
app.patch('/api/user/update', updateUserValidation, userUpdate);

app.get('/api/task/getall', getAllTasks);
app.post('/api/task/create', taskCreateValidation, createTask);
app.delete('/api/task/delete', deleteTask);
app.patch('/api/task/update', taskUpdateValidation, updateTask);

const PORT = process.env.PORT || 4001;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server has been started on port ${PORT}...`)
})