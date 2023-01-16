import { Router } from "express";

import { registerUserValidation, loginUserValidation, taskValidation, passwordValidation, nameValidation } from '../validations/validation.js';
import { userLogin, userRegister, userDelete, userLoginByToken, confirmPassword, userUpdateName, userUpdatePassword } from "../controllers/userController.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { uploadAvatar, deleteAvatar } from '../controllers/uploadController.js';
import { validationErrors, checkAuth } from '../middlewares/index.js';
import { upload } from '../utils/multerUpload.js'

const router = new Router();

router.get('/user/me', checkAuth, userLoginByToken);
router.post('/user/login', loginUserValidation, validationErrors, userLogin);
router.post('/user/register', registerUserValidation, validationErrors, userRegister);
router.post('/user/password', checkAuth, passwordValidation, validationErrors, confirmPassword);
router.patch('/user/name', checkAuth, nameValidation, validationErrors, userUpdateName);
router.patch('/user/password', checkAuth, passwordValidation, validationErrors, userUpdatePassword);
router.delete('/user/me', checkAuth, userDelete);

router.post('/upload', checkAuth, upload.single('avatar'), uploadAvatar);
router.delete('/upload', checkAuth, deleteAvatar);

router.get('/task', checkAuth, getTasks);
router.post('/task', checkAuth, taskValidation, validationErrors, createTask);
router.delete('/task', checkAuth, deleteTask);
router.patch('/task', checkAuth, taskValidation, validationErrors, updateTask);

export default router;