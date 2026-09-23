const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');
const { getAllTasks, createTask, deleteTask } = require('../Controllers/task.controller.js');

router.get('/', verifyToken, verifyAdmin, getAllTasks);
router.post('/', verifyToken, verifyAdmin, createTask);
router.delete('/:id', verifyToken, verifyAdmin, deleteTask);

module.exports = router;