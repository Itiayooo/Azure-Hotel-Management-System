const express = require('express');
const router = express.Router();
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms } = require('../Controllers/room.controller');
const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');

router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', verifyToken, verifyAdmin, createRoom);
router.put('/:id', verifyToken, verifyAdmin, updateRoom);
router.delete('/:id', verifyToken, verifyAdmin, deleteRoom);

module.exports = router;