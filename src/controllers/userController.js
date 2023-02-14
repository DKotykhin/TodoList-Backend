import userService from '../services/userService.js';

class UserController {
    async loginByToken(req, res, next) {
        try {
            const user = await userService.loginByToken(req.userId);
            const { _id, email, name, avatarURL, createdAt } = user;

            res.json({
                _id, email, name, avatarURL, createdAt,
                message: `User ${name} successfully logged via token`,
            });
        } catch (error) {
            next(error)
        }
    }

    async register(req, res, next) {
        try {
            const user = await userService.register(req.body);
            const { user: { _id, email, name, createdAt }, token } = user;

            res.status(201).send({
                _id, email, name, createdAt, token,
                message: `User ${name} successfully created`,
            });
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const user = await userService.login(req.body);
            const { user: { _id, email, name, avatarURL, createdAt }, token } = user;

            res.json({
                _id, email, name, avatarURL, createdAt, token,
                message: `User ${name} successfully logged`,
            });
        } catch (error) {
            next(error)
        }
    }

    async updateName(req, res, next) {
        try {
            const updatedUser = await userService.updateName(req.body, req.userId);
            const { _id, email, name, avatarURL, createdAt } = updatedUser;

            res.json({
                _id, email, name, avatarURL, createdAt,
                message: `User ${name} successfully updated`,
            });
        } catch (error) {
            next(error)
        }
    }

    async confirmPassword(req, res, next) {
        try {
            const status = await userService.confirmPassword(req.body, req.userId);

            res.json(status);

        } catch (error) {
            next(error)
        }
    }

    async updatePassword(req, res, next) {
        try {
            const updatedUser = await userService.updatePassword(req.body, req.userId);

            res.json({
                updateStatus: true,
                message: `User ${updatedUser.name} successfully updated`,
            });
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const status = await userService.delete(req.userId);

            res.json({
                ...status,
                message: 'User successfully deleted'
            });
        } catch (error) {
            next(error)
        }
    }

    async statistic(req, res, next) {
        try {
            const taskStatistic = await userService.statistic(req.userId);
            res.json({
                ...taskStatistic,
                message: 'Statistic successfully obtained'
            });
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController;
