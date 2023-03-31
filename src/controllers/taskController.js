import taskService from '../services/taskService.js';

class TaskController {
    async getAll(req, res, next) {
        try {
            const tasksData = await taskService.getAll(req.query, req.userId);

            res.json(tasksData);

        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const task = await taskService.getOne(req.params.id, req.userId);

            res.json(task);

        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const newTask = await taskService.create(req.body, req.userId);

            res.status(201).send({
                ...newTask._doc,
                message: 'Task successfully created'
            });
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const updatedTask = await taskService.update(req.body, req.userId);

            res.json({
                ...updatedTask._doc,
                message: 'Task successfully updated'
            });
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const taskStatus = await taskService.delete(req.body, req.userId)

            res.json({
                taskStatus,
                message: 'Task successfully deleted'
            });
        } catch (error) {
            next(error)
        }
    }
}

export default new TaskController;
