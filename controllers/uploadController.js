import fs from 'fs';

import UserModel from '../models/User.js';

export const uploadImage = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { avatarURL: `/${req.file.filename}` },
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

export const deleteImage = async (req, res) => {
    try {
        const fileName = req.params.avatarId;
        const directoryPath = "uploads";
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        // const { _id } = user._doc;
        // res.json(_id)
        
        fs.unlink(directoryPath + fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Can't delete avatar. " + err,
                });
            }

            res.status(200).send({
                message: "Avatar successfully deleted.",
            });
        });                

    } catch (err) {
        res.status(500).json({
            message: "Can't delete avatar"
        })
    }
}