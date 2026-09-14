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

router.get('/', getAllPhysicalRooms);
router.get('/:id', getPhysicalRoomById);
router.post('/', createPhysicalRoom);
router.put('/:id', updatePhysicalRoom);
router.patch('/:id/status', updatePhysicalRoomStatus);
router.delete('/:id', deletePhysicalRoom);

module.exports = router;