import ApiError from '../error/apiError.js';
import TaskModel from '../models/Task.js';

class TaskService {
    async getAll(data, userId) {

        const { limit, page, tabKey, sortField, sortOrder, search } = data;

        const parseLimit = parseInt(limit);
        const tasksOnPage = parseLimit > 0 ? parseLimit : 6;

        const parsePage = parseInt(page)
        const pageNumber = parsePage > 0 ? parsePage : 1;

        const parseSortOrder = sortOrder === '-1' || sortOrder === '1' ? sortOrder : '1';

        let sortKey = {};
        switch (sortField) {
            case "createdAt": sortKey = { [sortField]: -parseSortOrder };
                break;
            case "deadline": sortKey = { [sortField]: +parseSortOrder };
                break;
            case "title": sortKey = { [sortField]: +parseSortOrder };
                break;
            default: sortKey = { createdAt: 1 };
        };

        let taskFilter = {};
        switch (tabKey) {
            case '0':
                taskFilter = { author: userId, completed: false };
                break;
            case '1':
                taskFilter = { author: userId, deadline: { $lt: new Date() }, completed: false };
                break;
            case '2':
                taskFilter = { author: userId, completed: true };
                break;
            default:
                taskFilter = { author: userId };
        };

        if (search) taskFilter =
            { ...taskFilter, title: { $regex: search, $options: 'i' } };

        const totalTasksQty = (await TaskModel.find(taskFilter)).length;
        const totalPagesQty = Math.ceil(totalTasksQty / tasksOnPage);

        const tasks = await TaskModel.find(taskFilter, { author: false })
            .sort(sortKey)
            .limit(tasksOnPage)
            .skip((pageNumber - 1) * tasksOnPage);

        const tasksOnPageQty = tasks.length;

        return { totalTasksQty, totalPagesQty, tasksOnPageQty, tasks };
    }

    async getOne(_id, userId) {
        const task = await TaskModel.findOne({ _id, author: userId }, { author: false });
        if (!task) throw ApiError.notFound("Can't find task");

        return task;
    }

    async create(data, userId) {
        const { title, subtitle, description, completed, deadline } = data;
        const doc = new TaskModel({
            title,
            subtitle,
            description,
            completed,
            deadline,
            author: userId
        });
        const task = await doc.save();

        return task;
    }

    async update(data, userId) {
        const { title, subtitle, description, _id, completed, deadline } = data;

        let completedAt = null;
        if (completed) completedAt = new Date();

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id, author: userId },
            {
                $set: {
                    title,
                    subtitle,
                    description,
                    completed,
                    deadline,
                    completedAt,
                }
            },
            { returnDocument: 'after', fields: { author: false } },
        );
        if (!updatedTask) {
            throw ApiError.forbidden("Modified forbidden")
        }

        return updatedTask;
    }

    async delete(taskId, userId) {
        const { _id } = taskId;

        const taskStatus = await TaskModel.deleteOne({ _id, author: userId });
        if (!taskStatus.deletedCount) {
            throw ApiError.forbidden("Deleted forbidden")
        }

        return taskStatus;
    }
}

export default new TaskService;