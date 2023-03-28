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

class UserService {

    async loginByToken(id) {
        const user = await findUserById(id);

        return user;
    }

    async register(data) {
        const { email, name, password } = data;
        const candidat = await UserModel.findOne({ email });
        if (candidat) {
            throw ApiError.badRequest(`User ${email} already exist`)
        }
        const passwordHash = await createPasswordHash(password);
        const user = await UserModel.create({
            email,
            passwordHash,
            name,
        });
        const token = generateToken(user._id);

        return { user, token };
    }

    async login(data) {
        const { email, password } = data;
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.notFound("Can't find user")
        }
        const isValidPass = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPass) {
            throw ApiError.badRequest('Incorrect login or password')
        }
        const token = generateToken(user._id);

        return { user, token };
    }

    async updateName(data, _id) {
        if (!data) {
            throw ApiError.badRequest("No data")
        }
        const { name } = data;
        const user = await findUserById(_id);

        if (name === user.name) {
            throw ApiError.badRequest("The same name!")
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id },
            { name },
            { returnDocument: 'after' },
        );

        return updatedUser;
    }

    async confirmPassword(data, _id) {
        const { password } = data;
        const user = await findUserById(_id);
        const isValidPass = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPass) {
            return {
                confirmStatus: false,
                message: "Wrong password!"
            }
        } else return {
            confirmStatus: true,
            message: 'Password confirmed'
        }
    }

    async updatePassword(data, _id) {
        if (!data) {
            throw ApiError.badRequest("No data")
        }
        const { password } = data;
        const user = await findUserById(_id);

        const isValidPass = await bcrypt.compare(password, user.passwordHash);
        if (isValidPass) {
            throw ApiError.badRequest("The same password!")
        }
        const passwordHash = await createPasswordHash(password);

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id },
            { passwordHash },
            { returnDocument: 'after' },
        );
        if (!updatedUser) {
            throw ApiError.forbidden("Modified forbidden")
        }

        return updatedUser;
    }

    async delete(_id) {
        const user = await findUserById(_id);
        if (user.avatarURL) {
            fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
                if (err) {
                    throw ApiError.internalError("Can't delete avatar")
                }
            })
        }
        const taskStatus = await TaskModel.deleteMany({ author: _id });
        const userStatus = await UserModel.deleteOne({ _id });

        return { taskStatus, userStatus };
    }

    async statistic(_id) {
        const totalTasks = TaskModel.countDocuments(
            { author: _id }
        );
        const completedTasks = TaskModel.countDocuments(
            {
                author: _id,
                completed: true
            }
        );
        const overdueTasks = TaskModel.countDocuments(
            {
                author: _id,
                deadline: { $lt: new Date() },
                completed: false
            }
        );
        const values = Promise.all([totalTasks, completedTasks, overdueTasks]).then(values => {
            const activeTasks = values[0] - values[1];
            return {
                totalTasks: values[0],
                completedTasks: values[1],
                activeTasks,
                overdueTasks: values[2]
            }
        });

        return values;
    }
}

export default new UserService;