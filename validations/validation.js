import { body } from 'express-validator';

export const registerUserValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
    body('name', 'Укажите имя, минимум 3 символа').isLength({ min: 3 }),
    body('avatarURL', 'Неверная ссылка').optional().isURL(),
];

export const loginUserValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),   
];

export const updateUserValidation = [
    body('password', 'Пароль должен быть минимум 6 символов').optional().isLength({ min: 6 }),   
    body('name', 'Укажите имя, минимум 3 символа').optional().isLength({ min: 3 }),
];

export const taskCreateValidation = [
    body('title', 'Введите минимум 3 символа').isLength({ min: 3 }),
    body('subtitle', 'Введите строку').optional().isString(),
    body('description', 'Введите строку').optional().isString(),
];

export const taskUpdateValidation = [
    body('title', 'Введите минимум 3 символа').optional().isLength({ min: 3 }),
    body('subtitle', 'Введите строку').optional().isString(),
    body('description', 'Введите строку').optional().isString(),
];