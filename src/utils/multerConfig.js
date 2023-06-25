import multer from 'multer';
import fs from 'fs';
// import path from 'path';

import ApiError from '../error/apiError.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // cb(null, req.userId + '-avatar' + path.extname(file.originalname))
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(ApiError.internalError('Wrong file format. Please upload only images'), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024000, files: 1, fields: 2 },
});
