import UserModel from '../models/User.js';

export const uploadImage = async (req, res) => { 
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { avatarURL: `/upload/${req.file.filename}` },
            { returnDocument: 'after' },
        );
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        res.json(user)           
        // res.json({
        //     message: `${req.file.originalname} successfully upload`,
        //     url: `/uploads/${req.file.filename}`
        // })
    } catch (err) {
        res.status(500).json({
            message: "Can't upload file"
        })
    }  
}