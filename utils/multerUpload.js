import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.userId + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Wrong file format'), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024000, files: 1, fields: 2 },
});
