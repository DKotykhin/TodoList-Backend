import express from "express";

import userController from "../controllers/userController.js";
import avatarController from "../controllers/avatarController.js";
import taskController from "../controllers/taskController.js";

import validation from "../validations/validation.js";
import { validationErrors, checkAuth } from '../middlewares/index.js';
import { upload } from '../utils/multerUpload.js'

const router = express.Router();

router.post('/auth/register', validation.register, validationErrors, userController.register);
router.post('/auth/login', validation.login, validationErrors, userController.login);

router.get('/user/me', checkAuth, userController.loginByToken);
router.patch('/user/name', checkAuth, validation.name, validationErrors, userController.updateName);
router.post('/user/password', checkAuth, validation.password, validationErrors, userController.confirmPassword);
router.patch('/user/password', checkAuth, validation.password, validationErrors, userController.updatePassword);
router.delete('/user/me', checkAuth, userController.delete);

router.post('/avatar', checkAuth, upload.single('avatar'), avatarController.upload);
router.delete('/avatar', checkAuth, avatarController.delete);

router.get('/task', checkAuth, taskController.get);
router.post('/task', checkAuth, validation.task, validationErrors, taskController.create);
router.patch('/task', checkAuth, validation.task, validationErrors, taskController.update);
router.delete('/task', checkAuth, taskController.delete);

export default router;