const Task = require('../Models/task.model.js');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('postedBy', 'name').sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { text } = req.body;
        const task = await Task.create({ postedBy: req.user.id, text });
        const populated = await task.populate('postedBy', 'name');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create task', error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};

module.exports = { getAllTasks, createTask, deleteTask };