import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const userRegister = async (req, res) => {
    try {
        const candidat = await UserModel.findOne({ email: req.body.email });
        if (candidat) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }

        const { email, name, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email,
            passwordHash,
            name,
        });
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
            process.env.SECRET_KEY, {
            expiresIn: "7d"
        })

        // res.json({ ...user._doc, token })
        const { _id, createdAt } = user._doc;
        res.status(200).send({
            _id, email, name, createdAt, token,
            message: "User successfully created",
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't register user"
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
        const isValidPass = await bcrypt.compare(password, user._doc.passwordHash)
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
        // const { passwordHash, ...userData } = user._doc;
        // res.json({ ...userData, token });
        const { _id, name, avatarURL, createdAt } = user._doc;
        res.status(200).send({
            _id, email, name, avatarURL, createdAt, token,
            message: "User successfully logged",
        });

    } catch (err) {
        res.status(500).json({
            message: 'Autorization error'
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
        // const { passwordHash, ...userData } = user._doc;
        // res.json(userData)
        const { _id, email, name, avatarURL, createdAt } = user._doc;
        res.status(200).send({
            _id, email, name, avatarURL, createdAt,
            message: "User successfully logged via token",
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
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt)
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
        // res.json(user)
        const { _id, email, avatarURL, createdAt } = user._doc;
        res.status(200).send({
            _id, email, name, avatarURL, createdAt,
            message: "User successfully updated",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const userDelete = async (req, res) => {
    try {
        const user = await UserModel.deleteOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        res.status(200).send({ message: 'User successfully deleted' })
    } catch (err) {
        res.status(500).json({
            message: "Can't delete user"
        })
    }
}