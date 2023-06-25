import { upload } from '../utils/multerConfig.js';

const uploadFile = (req, res, next) => {
    const uploadSingleImage = upload.single('avatar');

    uploadSingleImage(req, res, function (err) {
        if (err) {
            // console.log('multer error: ', err.message);
            next(err);
        }
        next()
    })
}

export default uploadFile;