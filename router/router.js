import { Router } from "express";

import { registerUserValidation, loginUserValidation, updateUserValidation, taskCreateValidation, taskUpdateValidation } from '../validations/validation.js';
import { userLogin, userRegister, userDelete, userLoginByToken, userUpdate, confirmPassword } from "../controllers/userController.js";
import { createTask, deleteTask, getAllTasks, updateTask } from "../controllers/taskController.js";
import { uploadAvatar, deleteAvatar } from '../controllers/uploadController.js';
import { validationErrors, checkAuth } from '../middlewares/index.js';
import multerUpload from '../utils/multerUpload.js'

const router = new Router();

router.get('/user/me', checkAuth, userLoginByToken);
router.post('/user/login', loginUserValidation, validationErrors, userLogin);
router.post('/user/register', registerUserValidation, validationErrors, userRegister);
router.post('/user/password', checkAuth, confirmPassword);
router.delete('/user/me', checkAuth, userDelete);
router.patch('/user/me', checkAuth, updateUserValidation, validationErrors, userUpdate);

router.post('/upload', checkAuth, multerUpload(), uploadAvatar);
router.delete('/upload', checkAuth, deleteAvatar);

router.get('/task', checkAuth, getAllTasks);
router.post('/task', checkAuth, taskCreateValidation, validationErrors, createTask);
router.delete('/task', checkAuth, deleteTask);
router.patch('/task', checkAuth, taskUpdateValidation, validationErrors, updateTask);

export default router;