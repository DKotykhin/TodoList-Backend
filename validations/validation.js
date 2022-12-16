import { body } from 'express-validator';

export const registerUserValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password must be at least 8 chars long').isLength({ min: 8 }),
    body('name', 'Name must be at least 3 chars long').isLength({ min: 3 }),
    body('avatarURL', 'Incorrect URL').optional().isURL(),
];

export const loginUserValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password must be at least 8 chars long').isLength({ min: 8 }),   
];

export const updateUserValidation = [
    body('password', 'Password must be at least 8 chars long').optional().isLength({ min: 8 }),   
    body('name', 'Name must be at least 3 chars long').optional().isLength({ min: 3 }),
];

export const taskCreateValidation = [
    body('title', 'Title must be at least 3 chars long').isLength({ min: 3 }),
    body('subtitle', 'Incorrect data format').optional().isString(),
    body('description', 'Incorrect data format').optional().isString(),
    body('completed', 'Incorrect data format').isBoolean(),
    body('deadline', 'Incorrect data format').optional().isString(),
];

export const taskUpdateValidation = [
    body('title', 'Title must be at least 3 chars long').optional().isLength({ min: 3 }),
    body('subtitle', 'Incorrect data format').optional().isString(),
    body('description', 'Incorrect data format').optional().isString(),
    body('completed', 'Incorrect data format').isBoolean(),
    body('deadline', 'Incorrect data format').optional().isString(),
];