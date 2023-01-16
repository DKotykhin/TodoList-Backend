import fs from 'fs';

import UserModel from '../models/User.js';
import ApiError from '../error/apiError.js';
import { findUserById } from '../utils/findUserById.js';

export const uploadAvatar = async (req, res, next) => {
    if (!req.file) {
        return next(ApiError.notFound("No file to upload"))
    }
    const user = await UserModel.findOneAndUpdate(
        { _id: req.userId },
        { avatarURL: `/upload/${req.file.filename}` },
        { returnDocument: 'after' },
    );
    if (!user) {
        return next(ApiError.notFound("Can't find user"))
    }
    res.json({
        avatarURL: user.avatarURL,
        message: "Avatar successfully upload.",
    });
}

export const deleteAvatar = async (req, res, next) => {
    const user = await findUserById(req.userId);
    fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
        if (err) {
            return next(ApiError.internalError("Can't delete avatar"))
        }
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { avatarURL: '' },
            { returnDocument: 'after' },
        );

        res.json({
            avatarURL: updateUser.avatarURL,
            message: "Avatar successfully deleted.",
        });
    });
}