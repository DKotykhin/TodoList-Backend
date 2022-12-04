import fs from 'fs';

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
        res.status(200).send({
            avatarURL: user.avatarURL,
            message: "Avatar successfully upload.",
        });

    } catch (err) {
        res.status(500).json({
            message: "Can't upload avatar"
        })
    }
}

export const deleteImage = async (req, res) => {
    try {
        const fileName = req.params.avatarId;
        const directoryPath = "uploads/";
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }  
        
        fs.unlink(directoryPath + fileName, async (err) => {
            if (err) {
                res.status(500).send({
                    message: "Can't delete avatar. " + err,
                });
            }
            const updateUser = await UserModel.findOneAndUpdate(
                { _id: req.userId },
                { avatarURL: null },
                { returnDocument: 'after' },
            );
            const { _id, email, name, avatarURL, createdAt } = updateUser._doc;
            res.status(200).send({
                _id, email, name, avatarURL, createdAt,
                message: "Avatar successfully deleted.",
            });            
        });                

    } catch (err) {
        res.status(500).json({
            message: "Can't delete avatar"
        })
    }
}