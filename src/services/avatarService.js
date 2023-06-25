import fs from 'fs';

import UserModel from '../models/User.js';
import ApiError from '../error/apiError.js';
import { findUserById } from '../utils/findUserById.js';

class AvatarService {
    async upload(fileName, _id) {
        if (!fileName) {
            throw ApiError.notFound("File name error")
        }
        const user = await UserModel.findOneAndUpdate(
            { _id },
            { avatarURL: `/upload/${fileName}` },
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