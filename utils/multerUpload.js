import multer from 'multer';

const multerUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            cb(null, req.userId + '-' + file.originalname)
        }
    });
    const upload = multer({
        storage, 
        fileFilter: function fileFilter(req, file, cb) {
            if (file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'image/png') {
                cb(null, true)
            } else {
                cb(null, false)
                // cb(new Error('Wrong file format'))                
            }
        }, 
        limits: { fileSize: 1024000 },
    });
    return upload.single('image')
}

export default multerUpload;