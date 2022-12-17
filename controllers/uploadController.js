import fs from 'fs';

import UserModel from '../models/User.js';
import ApiError from '../error/apiError.js';

export const uploadAvatar = async (req, res, next) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.userId },
        { avatarURL: `/upload/${req.file.filename}` },
        { returnDocument: 'after' },
    );
    if (!user) {
        return next(ApiError.notFound("Can't find user"))
    }
    res.status(200).send({
        avatarURL: user.avatarURL,
        message: "Avatar successfully upload.",
    });
}

export const deleteAvatar = async (req, res, next) => {
    const user = await UserModel.findById(req.userId);
    if (!user) {
        return next(ApiError.notFound("Can't find user"))
    }
    fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
        if (err) {
            return next(ApiError.internalError("Can't delete avatar"))
        }
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { avatarURL: '' },
            { returnDocument: 'after' },
        );

        res.status(200).send({
            avatarURL: updateUser.avatarURL,
            message: "Avatar successfully deleted.",
        });
    });
}