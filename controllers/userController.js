import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const candidat = await UserModel.findOne({ email: req.body.email });
        if (candidat) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: passwordHash,
            name: req.body.name,
            avatarURL: req.body.avatarURL,
        });
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
            process.env.SECRET_KEY, {
            expiresIn: "7d"
        })

        res.json({ ...user._doc, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't register user"
        })
    }
}

export const userLogin = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: `Can't find user ${req.body.email}`
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Incorrect login or password'
            })
        }
        const token = jwt.sign({
            _id: user._id,
        },
            process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        res.json({ ...user._doc, token })
    } catch (err) {
        res.status(500).json({
            message: 'Autorization error'
        })
    }
}

export const userLoginByToken = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
            const user = await UserModel.findOne({ _id: decoded._id });
            if (!user) {
                return res.status(404).json({
                    message: "Can't find user"
                })
            }
            res.json(user)
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const userUpdate = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }

            let passwordHash;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                passwordHash = await bcrypt.hash(req.body.password, salt)
            }
    
            const user = await UserModel.findOneAndUpdate(
                { _id: decoded._id },
                { name: req.body.name, passwordHash },
                { returnDocument: 'after' },
            );
            if (!user) {
                return res.status(404).json({
                    message: "Can't find user"
                })
            }
            res.json(user)
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const userDelete = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
            const user = await UserModel.deleteOne({ _id: decoded._id });
            if (!user) {
                return res.status(404).json({
                    message: "Can't find user"
                })
            }
            res.json({ message: 'User successfully deleted' })
        });
    } catch (err) {
        res.status(500).json({
            message: "Can't delete user"
        })
    }
}