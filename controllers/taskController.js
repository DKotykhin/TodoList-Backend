import ApiError from '../error/apiError.js';
import TaskModel from '../models/Task.js';

export const getAllTasks = async (req, res) => {
    const allTask = await TaskModel.find(
        { author: req.userId },
        { title: true, subtitle: true, description: true, completed: true, createdAt: true, deadline: true }
    );

    res.status(200).send(allTask);
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
    const status = await TaskModel.updateOne(
        { _id, author: req.userId },
        {
            $set: {
                title,
                subtitle,
                description,
                completed,
                deadline
            }
        });
    if (!status.modifiedCount) {
        return next(ApiError.forbidden("Modified forbidden"))
    }

    res.status(200).send({
        status,
        message: 'Task successfully updated'
    });
};

export const deleteTask = async (req, res, next) => {    
    const { _id } = req.body;
    const status = await TaskModel.deleteOne({ _id, author: req.userId });
    if (!status.deletedCount) {
        return next(ApiError.forbidden("Deleted forbidden"))
    }

    res.status(200).send({
        status,
        message: 'Task successfully deleted'
    });
};