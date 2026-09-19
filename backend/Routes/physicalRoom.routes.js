const express = require('express');
const router = express.Router();
const {
    getAllPhysicalRooms,
    getPhysicalRoomById,
    createPhysicalRoom,
    updatePhysicalRoom,
    updatePhysicalRoomStatus,
    deletePhysicalRoom,
} = require('../Controllers/physicalRoom.controller.js');

const verifyToken = require('../Middleware/verifyToken.js');
const verifyAdmin = require('../Middleware/verifyAdmin.js');

router.get('/', getAllPhysicalRooms);
router.get('/:id', getPhysicalRoomById);
router.post('/', verifyToken, verifyAdmin, createPhysicalRoom);
router.put('/:id', verifyToken, verifyAdmin, updatePhysicalRoom);
router.patch('/:id/status', verifyToken, verifyAdmin, updatePhysicalRoomStatus);
router.delete('/:id', verifyToken, verifyAdmin, deletePhysicalRoom);

module.exports = router;