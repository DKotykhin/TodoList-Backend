import { validationResult } from 'express-validator';

const validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next()
}

export default validationErrors;