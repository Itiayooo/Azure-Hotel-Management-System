const PhysicalRoom = require('../Models/physicalRoom.model.js');

// GET /api/physical-rooms
const getAllPhysicalRooms = async (req, res) => {
  try {
    const rooms = await PhysicalRoom.find().populate('roomType');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch physical rooms', error: error.message });
  }
};

// GET /api/physical-rooms/:id
const getPhysicalRoomById = async (req, res) => {
  try {
    const room = await PhysicalRoom.findById(req.params.id).populate('roomType');
    if (!room) {
      return res.status(404).json({ message: 'Physical room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch physical room', error: error.message });
  }
};

// POST /api/physical-rooms
const createPhysicalRoom = async (req, res) => {
  try {
    const room = await PhysicalRoom.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create physical room', error: error.message });
  }
};

// PUT /api/physical-rooms/:id
const updatePhysicalRoom = async (req, res) => {
  try {
    const room = await PhysicalRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ message: 'Physical room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update physical room', error: error.message });
  }
};

// PATCH /api/physical-rooms/:id/status
const updatePhysicalRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await PhysicalRoom.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Physical room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update room status', error: error.message });
  }
};

// DELETE /api/physical-rooms/:id
const deletePhysicalRoom = async (req, res) => {
  try {
    const room = await PhysicalRoom.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Physical room not found' });
    }
    res.status(200).json({ message: 'Physical room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete physical room', error: error.message });
  }
};

module.exports = {
  getAllPhysicalRooms,
  getPhysicalRoomById,
  createPhysicalRoom,
  updatePhysicalRoom,
  updatePhysicalRoomStatus,
  deletePhysicalRoom,
};