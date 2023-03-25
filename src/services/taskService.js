import ApiError from '../error/apiError.js';
import TaskModel from '../models/Task.js';

class TaskService {
    async getAll(data, userId) {

        const { limit, page, tabKey, sortField, sortOrder, search } = data;

        const parseLimit = parseInt(limit);
        const tasksOnPage = parseLimit > 0 ? parseLimit : 6;

        const parsePage = parseInt(page)
        const pageNumber = parsePage > 0 ? parsePage : 1;

        const parseSortField = sortField === "createdAt" ? sortField
            : sortField === "deadline" ? sortField
                : sortField === "title" ? sortField
                    : "createdAt";

        const parseSortOrder = sortOrder === '-1' || sortOrder === '1' ? sortOrder : '-1';

        const sortKey = {
            [parseSortField]: +parseSortOrder
        };

        let taskFilter = { author: userId };
        if (tabKey === '1') taskFilter = { ...taskFilter, completed: false };
        if (tabKey === '2') taskFilter = { ...taskFilter, completed: true };
        if (search) taskFilter =
            { ...taskFilter, title: { $regex: search, $options: 'i' } };

        const totalTasksQty = (await TaskModel.find(taskFilter)).length;
        const totalPagesQty = Math.ceil(totalTasksQty / tasksOnPage);

        const tasks = await TaskModel.find(taskFilter, {
            title: true,
            subtitle: true,
            description: true,
            completed: true,
            createdAt: true,
            deadline: true
        }).sort(sortKey).limit(tasksOnPage).skip((pageNumber - 1) * tasksOnPage);

        const tasksOnPageQty = tasks.length;

        return { totalTasksQty, totalPagesQty, tasksOnPageQty, tasks };
    }

    async getOne(_id, userId) {
        const task = await TaskModel.findOne({ _id, author: userId });
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

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id, author: userId },
            {
                $set: {
                    title,
                    subtitle,
                    description,
                    completed,
                    deadline
                }
            },
            { returnDocument: 'after' },
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