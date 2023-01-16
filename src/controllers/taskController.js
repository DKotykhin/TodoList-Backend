import ApiError from '../error/apiError.js';
import TaskModel from '../models/Task.js';

export const getTasks = async (req, res) => {

    const { userId, query: { limit, page, tabKey, sortField, sortOrder, search } } = req;

    const parseLimit = parseInt(limit);
    const tasksOnPage = parseLimit > 0 ? parseLimit : 6;

    const parsePage = parseInt(page)
    const pageNumber = parsePage > 0 ? parsePage : 1;

    const parseSortField = sortField ? sortField : "createdAt";
    const parseSortOrder = sortOrder ? sortOrder : -1;

    let taskFilter = { author: userId };
    if (tabKey === '1') taskFilter = { ...taskFilter, completed: false };
    if (tabKey === '2') taskFilter = { ...taskFilter, completed: true };
    if (search) taskFilter =
        { ...taskFilter, title: { $regex: search, $options: 'i' } };

    const map = new Map();
    map.set(parseSortField, parseSortOrder);
    const sortKey = Object.fromEntries(map);

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

    res.json({
        totalTasksQty, totalPagesQty, tasksOnPageQty, tasks
    });
};

export const createTask = async (req, res, next) => {
    const { title, subtitle, description, completed, deadline } = req.body;
    const doc = new TaskModel({
        title,
        subtitle,
        description,
        completed,
        deadline,
        author: req.userId
    });
    const task = await doc.save();
    const { _id, createdAt } = task;

    res.status(201).send({
        _id, title, subtitle, description, completed, createdAt, deadline,
        message: 'Task successfully created'
    });
};

export const updateTask = async (req, res, next) => {
    const { title, subtitle, description, _id, completed, deadline } = req.body;

    const updatedTask = await TaskModel.findOneAndUpdate(
        { _id, author: req.userId },
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
        return next(ApiError.forbidden("Modified forbidden"))
    }

    res.json({
        _id,
        title: updatedTask.title,
        subtitle: updatedTask.subtitle,
        description: updatedTask.description,
        completed: updatedTask.completed,
        deadline: updatedTask.deadline,
        createdAt: updatedTask.createdAt,
        message: 'Task successfully updated'
    });
};

export const deleteTask = async (req, res, next) => {
    const { _id } = req.body;

    const taskStatus = await TaskModel.deleteOne({ _id, author: req.userId });
    if (!taskStatus.deletedCount) {
        return next(ApiError.forbidden("Deleted forbidden"))
    }

    res.json({
        taskStatus,
        message: 'Task successfully deleted'
    });
};