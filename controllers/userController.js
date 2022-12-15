import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

import UserModel from '../models/User.js';
import TaskModel from '../models/Task.js';
import { createPasswordHash } from '../utils/createPasswordHash.js';

export const userRegister = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const candidat = await UserModel.findOne({ email });
        if (candidat) {
            return res.status(400).json({
                message: `User ${email} already exist`
            })
        }

        const passwordHash = await createPasswordHash(password);
        const user = await UserModel.create({
            email,
            passwordHash,
            name,
        });

        const token = jwt.sign({
            _id: user._id,
        },
            process.env.SECRET_KEY, {
            expiresIn: "2d"
        })

        const { _id, createdAt } = user;
        res.status(201).send({
            _id, email, name, createdAt, token,
            message: `User ${name} successfully created`,
        });

    } catch (err) {        
        res.status(500).json({
            message: err.message
        })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: `Can't find user ${email}`
            })
        }
        const isValidPass = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Incorrect login or password'
            })
        }
        const token = jwt.sign({
            _id: user._id,
        },
            process.env.SECRET_KEY, {
            expiresIn: "2d"
        });

        const { _id, name, avatarURL, createdAt } = user;
        res.status(200).send({
            _id, email, name, avatarURL, createdAt, token,
            message: `User ${name} successfully logged`,
        });

    } catch (err) {
        res.status(500).json({            
            message: err.message
        })
    }
}

export const userLoginByToken = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        const { _id, email, name, avatarURL, createdAt } = user;
        res.status(200).send({
            _id, email, name, avatarURL, createdAt,
            message: `User ${name} successfully logged via token`,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const userUpdate = async (req, res) => {
    try {
        const { name, password } = req.body;
        let passwordHash;
        if (password) {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(404).json({
                    message: "Can't find user"
                })
            }
            const isValidPass = await bcrypt.compare(password, user.passwordHash);
            if (isValidPass) {
                return res.status(400).send({ message: "The same password!" })
            }
            passwordHash = await createPasswordHash(password);
        }

        const user = await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { name, passwordHash },
            { returnDocument: 'after' },
        );
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        const { _id, email, avatarURL, createdAt } = user;
        res.status(200).send({
            _id, email, name: user.name, avatarURL, createdAt,
            message: `User ${user.name} successfully updated`,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const userDelete = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }

        if (user.avatarURL) {
            fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
                if (err) {
                    res.status(500).send({
                        message: "Can't delete avatar. " + err,
                    });
                }
            })
        }
        const taskStatus = await TaskModel.deleteMany({ author: req.userId });
        const userStatus = await UserModel.deleteOne({ _id: req.userId });

        res.status(200).send({ taskStatus, userStatus, message: 'User successfully deleted' })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const confirmPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        const isValidPass = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPass) {
            return res.status(200).send({ status: false, message: "Wrong password!" })
        }
        res.status(200).send({ status: true, message: 'Password confirmed' })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}