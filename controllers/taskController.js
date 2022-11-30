import TaskModel from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const { title, subtitle, description } = req.body;
        const doc = new TaskModel({
            title,
            subtitle,
            description,
            author: req.userId
        });
        const task = await doc.save();
        res.json(task);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't create task"
        })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { _id } = req.body;
        const task = await TaskModel.deleteOne({ _id, author: req.userId });
            if (!task) {
                return res.status(404).json({
                    message: "Can't find task"
                })
            }
            if (!task.deletedCount) {
                return res.status(403).json({
                    message: "Deleted forbidden"
                })
            }
            res.json({ message: 'Task successfully deleted' });
    } catch (err) {
        res.status(500).json({
            message: "Can't delete task"
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, subtitle, description, _id } = req.body;
        const task = await TaskModel.updateOne(
            { _id, author: req.userId },
            {
                $set: {
                    title,
                    subtitle,
                    description,
                }
            });
        if (!task) {
            return res.status(404).json({
                message: "Can't find task"
            })
        }
        if (!task.modifiedCount) {
            return res.status(403).json({
                message: "Modified forbidden"
            })
        }
        res.json({ message: 'Task successfully updated', task });
    } catch (err) {
        res.status(500).json({
            message: "Can't update task"
        })
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const allTask = await TaskModel.find({ author: req.userId });
            res.json(allTask);
    } catch (err) {
        res.status(500).json({
            message: "Can't find tasks"
        })
    }
}