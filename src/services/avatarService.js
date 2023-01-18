import fs from 'fs';

import UserModel from '../models/User.js';
import ApiError from '../error/apiError.js';
import { findUserById } from '../utils/findUserById.js';

class AvatarService {
    async upload(file, _id) {
        if (!file) {
            throw ApiError.notFound("No file to upload")
        }
        const user = await UserModel.findOneAndUpdate(
            { _id },
            { avatarURL: `/upload/${file.filename}` },
            { returnDocument: 'after' },
        );
        if (!user) {
            throw ApiError.notFound("Can't find user")
        }
        return user;
    }

    async delete(_id) {
        const user = await findUserById(_id);

        fs.unlink("uploads/" + user.avatarURL.split('/')[2], async (err) => {
            if (err) {
                throw ApiError.internalError("Can't delete avatar")
            }
        });

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id },
            { avatarURL: '' },
            { returnDocument: 'after' },
        );

        return updatedUser;
    }
}

export default new AvatarService;