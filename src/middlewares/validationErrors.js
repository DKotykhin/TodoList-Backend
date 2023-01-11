import { validationResult } from 'express-validator';

import ApiError from '../error/apiError.js';

const validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(ApiError.badRequest(errors.array()[0].msg))
    }
    next()
}

export default validationErrors;