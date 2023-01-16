import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

import UserModel from '../models/User.js';
import TaskModel from '../models/Task.js';
import ApiError from '../error/apiError.js';
import { findUserById } from '../utils/findUserById.js';

const generateToken = (_id) => {
    return jwt.sign(
        { _id },
        process.env.SECRET_KEY,
        { expiresIn: "2d" }
    )
};
const createPasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash
}

export const userRegister = async (req, res, next) => {
    const { email, name, password } = req.body;
    const candidat = await UserModel.findOne({ email });
    if (candidat) {
        return next(ApiError.badRequest(`User ${email} already exist`))
    }
    const passwordHash = await createPasswordHash(password);
    const user = await UserModel.create({
        email,
        passwordHash,
        name,
    });
    const token = generateToken(user._id);
    const { _id, createdAt } = user;

    res.status(201).send({
        _id, email, name, createdAt, token,
        message: `User ${name} successfully created`,
    });
}

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(ApiError.notFound("Can't find user"))
    }
    const isValidPass = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPass) {
        return next(ApiError.badRequest('Incorrect login or password'))
    }
    const token = generateToken(user._id);
    const { _id, name, avatarURL, createdAt } = user;

    res.json({
        _id, email, name, avatarURL, createdAt, token,
        message: `User ${name} successfully logged`,
    });
}

export const userLoginByToken = async (req, res, next) => {

    const user = await findUserById(req.userId);
    const { _id, email, name, avatarURL, createdAt } = user;

    res.json({
        _id, email, name, avatarURL, createdAt,
        message: `User ${name} successfully logged via token`,
    });
}

export const userUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(ApiError.badRequest("No data"));
    }
    const { name, password } = req.body;
    const user = await findUserById(req.userId);

    let passwordHash;
    if (password) {
        const isValidPass = await bcrypt.compare(password, user.passwordHash);
        if (isValidPass) {
            return next(ApiError.badRequest("The same password!"))
        }
        passwordHash = await createPasswordHash(password);
    }
    if (name) {
        if (name === user.name) {
            return next(ApiError.badRequest("The same name!"))
        }
    }
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.userId },
        { name, passwordHash },
        { returnDocument: 'after' },
    );
    const { _id, email, avatarURL, createdAt } = updatedUser;

    res.json({
        _id, email, name: updatedUser.name, avatarURL, createdAt,
        message: `User ${updatedUser.name} successfully updated`,
    });
}

export const userDelete = async (req, res, next) => {
    const user = await findUserById(req.userId);
    if (user.avatarURL) {
        fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
            if (err) {
                return next(ApiError.internalError("Can't delete avatar"))
            }
        })
    }
    const taskStatus = await TaskModel.deleteMany({ author: req.userId });
    const userStatus = await UserModel.deleteOne({ _id: req.userId });

    res.json({
        taskStatus, userStatus,
        message: 'User successfully deleted'
    })
}

export const confirmPassword = async (req, res, next) => {
    const { password } = req.body;
    const user = await findUserById(req.userId);
    const isValidPass = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPass) {
        return res.json({ status: false, message: "Wrong password!" })
    }

    res.json({
        status: true,
        message: 'Password confirmed'
    })
}