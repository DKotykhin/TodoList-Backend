import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { registerUserValidation, loginUserValidation, updateUserValidation, taskValidation } from './validations/validation.js';
import { userLogin, userRegister, userDelete, userLoginByToken, userUpdate } from "./controllers/userController.js";
import { createTask, deleteTask, getAllTasks, updateTask } from "./controllers/taskController.js"

dotenv.config();

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('Mongoose DB connected...'))
    .catch((err) => console.log('DB Error:', err))

const app = express();
app.use(express.json())

app.get('/api/user/loginbytoken', userLoginByToken);
app.post('/api/user/login', loginUserValidation, userLogin);
app.post('/api/user/register', registerUserValidation, userRegister);
app.delete('/api/user/delete', userDelete);
app.patch('/api/user/update', updateUserValidation, userUpdate);

app.get('/api/task/getall', getAllTasks);
app.post('/api/task/create', taskValidation, createTask);
app.delete('/api/task/delete', deleteTask);
app.patch('/api/task/update', updateTask);

const PORT = process.env.PORT || 4001;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server has been started on port ${PORT}...`)
})