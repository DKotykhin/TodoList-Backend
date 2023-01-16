import { body } from 'express-validator';

const email = body('email')
    .isEmail().withMessage('Incorrect email format');

const password = body('password')
    .isString().withMessage('Incorrect data format')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
    .isLength({ max: 100 }).withMessage('Password must be maximum 100 chars long');

const name = body('name')
    .isString().withMessage('Incorrect data format')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 chars long')
    .isLength({ max: 100 }).withMessage('Name must be maximum 100 chars long')

export const registerUserValidation = [
    email,
    password,
    name,
    body('avatarURL')
        .optional().isURL().withMessage('Incorrect URL')
];

export const loginUserValidation = [
    email,
    password
];

export const passwordValidation = [
    password
];

export const nameValidation = [
    name
];

export const taskValidation = [
    body('title')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 chars long'),
    body('subtitle')
        .optional().isString().withMessage('Incorrect data format'),
    body('description')
        .optional().isString().withMessage('Incorrect data format'),
    body('completed')
        .optional().isBoolean().withMessage('Incorrect data format'),
    body('deadline')
        .optional().isString().withMessage('Incorrect data format'),
];
