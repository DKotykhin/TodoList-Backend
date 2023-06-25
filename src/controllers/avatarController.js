import avatarService from '../services/avatarService.js';

class AvatarController {
    async upload(req, res, next) {        
        try {
            const user = await avatarService.upload(req.fileName, req.userId)
            res.json({
                avatarURL: user.avatarURL,
                message: "Avatar successfully upload.",
            });
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const updatedUser = await avatarService.delete(req.userId);
    
            res.json({
                avatarURL: updatedUser.avatarURL,
                message: "Avatar successfully deleted.",
            });
        } catch (error) {
            next(error)
        }
    }
}

export default new AvatarController;
