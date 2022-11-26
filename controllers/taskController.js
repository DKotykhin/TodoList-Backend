import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import TaskModel from '../models/Task.js';

export const createTask = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const token = req.headers.authorization.split(' ')[1];        
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {            
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }            
            const doc = new TaskModel({
                title: req.body.title,
                subtitle: req.body.subtitle,
                description: req.body.description,
                author: decoded._id
            });
            const task = await doc.save();            
            res.json(task)
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't create task"
        })
    }
}

export const deleteTask = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
            const task = await TaskModel.deleteOne({ _id: req.body._id, author: decoded._id });
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
            res.json({ message: 'Task successfully deleted' })
        });
    } catch (err) {
        res.status(500).json({
            message: "Can't delete task"
        })
    }
}

export const updateTask = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
            const task = await TaskModel.updateOne(
                { _id: req.body._id, author: decoded._id },
                {$set: {
                    title: req.body.title,
                    subtitle: req.body.subtitle,
                    description: req.body.description
                }});
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
            res.json({ message: 'Task successfully updated', task })
        });
    } catch (err) {
        res.status(500).json({
            message: "Can't update task"
        })
    }
}

export const getAllTasks = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Autorization error"
                })
            }
            const allTask = await TaskModel.find({ author: decoded._id });            
            res.json(allTask)
        });
    } catch (err) {
        res.status(500).json({
            message: "Can't find tasks"
        })
    }
}