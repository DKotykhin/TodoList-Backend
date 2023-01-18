import taskService from '../services/taskService.js';

class TaskController {
    async get(req, res, next) {
        try {
            const tasksData = await taskService.get(req.query, req.userId);

            res.json(tasksData);

        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const newTask = await taskService.create(req.body, req.userId);
            const { _id, title, subtitle, description, completed, createdAt, deadline } = newTask;

            res.status(201).send({
                _id, title, subtitle, description, completed, createdAt, deadline,
                message: 'Task successfully created'
            });
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const updatedTask = await taskService.update(req.body, req.userId);
            const { _id, title, subtitle, description, completed, createdAt, deadline } = updatedTask;

            res.json({
                _id, title, subtitle, description, completed, createdAt, deadline,
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
