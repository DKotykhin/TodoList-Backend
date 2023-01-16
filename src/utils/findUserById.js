import UserModel from '../models/User.js';
import ApiError from '../error/apiError.js';

export const findUserById = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        return next(ApiError.notFound("Can't find user"))
    }
    return user;
}