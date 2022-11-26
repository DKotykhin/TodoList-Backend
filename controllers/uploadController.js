import jwt from 'jsonwebtoken';

export const uploadImage = (req, res) => { 
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }            
            res.json({
                message: `${req.file.originalname} successfully upload`,
                url: `/uploads/${req.file.filename}`
            })
        });
    } catch (err) {
        res.status(500).json({
            message: "Can't upload file"
        })
    }  
}