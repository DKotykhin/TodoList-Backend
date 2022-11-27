import TaskModel from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const doc = new TaskModel({
            title: req.body.title,
            subtitle: req.body.subtitle,
            description: req.body.description,
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
        const task = await TaskModel.deleteOne({ _id: req.body._id, author: req.userId });
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
        const task = await TaskModel.updateOne(
            { _id: req.body._id, author: req.userId },
            {
                $set: {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
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