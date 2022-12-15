import TaskModel from '../models/Task.js';

export const getAllTasks = async (req, res) => {
    try {
        const allTask = await TaskModel.find(
            { author: req.userId },
            { title: true, subtitle: true, description: true, completed: true, createdAt: true, deadline: true }
        );
        res.status(200).send(allTask);
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};

export const createTask = async (req, res) => {
    try {
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
        // res.json(task);
        res.status(201).send({
            _id, title, subtitle, description, completed, createdAt, deadline,
            message: 'Task successfully created'
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
};

export const updateTask = async (req, res) => {
    try {
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
            return res.status(403).json({
                message: "Modified forbidden"
            })
        }
        res.status(200).send({
            status,
            message: 'Task successfully updated'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { _id } = req.body;
        const status = await TaskModel.deleteOne({ _id, author: req.userId });
        if (!status.deletedCount) {
            return res.status(403).json({
                message: "Deleted forbidden"
            })
        }
        res.status(200).send({
            status,
            message: 'Task successfully deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};