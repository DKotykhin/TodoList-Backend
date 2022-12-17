import jwt from 'jsonwebtoken';
import ApiError from '../error/apiError.js';

const checkAuth = (req, res, next) => {

    if (!req.headers.authorization) {
        return next(ApiError.forbidden("No autorization data"));
    }

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(ApiError.forbidden("Autorization denyed"));
        }
        req.userId = decoded._id;
        next()
    });
}

export default checkAuth;