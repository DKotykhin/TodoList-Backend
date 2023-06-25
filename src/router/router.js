import express from "express";

import { userController, avatarController, taskController } from "../controllers/_index.js";
import { validationErrors, checkAuth, resizeImages, uploadFile } from '../middlewares/_index.js';

import validation from "../validations/validation.js";

const router = express.Router();

router.post('/auth/register', validation.register, validationErrors, userController.register);
router.post('/auth/login', validation.login, validationErrors, userController.login);
router.post('/auth/reset', validation.email, validationErrors, userController.resetPassword);
router.patch('/auth/reset', validation.setNewPassword, validationErrors, userController.setNewPassword);

router.get('/user/me', checkAuth, userController.loginByToken);
router.get('/user/statistic', checkAuth, userController.statistic);
router.patch('/user/name', checkAuth, validation.name, validationErrors, userController.updateName);
router.post('/user/password', checkAuth, validation.password, validationErrors, userController.confirmPassword);
router.patch('/user/password', checkAuth, validation.password, validationErrors, userController.updatePassword);
router.delete('/user/me', checkAuth, userController.delete);

router.post('/avatar', checkAuth, uploadFile, resizeImages, avatarController.upload);
router.delete('/avatar', checkAuth, avatarController.delete);

router.get('/task', checkAuth, taskController.getAll);
router.get('/task/:id', checkAuth, taskController.getOne);
router.post('/task', checkAuth, validation.task, validationErrors, taskController.create);
router.patch('/task', checkAuth, validation.task, validationErrors, taskController.update);
router.delete('/task', checkAuth, taskController.delete);

export default router;