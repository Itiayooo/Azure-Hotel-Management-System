const Room = require("../Models/room.model.js");
const PhysicalRoom = require('../Models/physicalRooms.model.js');
const Booking = require('../Models/booking.model.js');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch room', error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { roomNumberPrefix, ...roomData } = req.body;

    if (!roomNumberPrefix) {
      return res.status(400).json({ message: 'Room number prefix is required' });
    }

    const room = await Room.create(roomData);

    // Auto-generate physical rooms matching totalRooms
    const physicalRoomsToCreate = [];
    for (let i = 1; i <= room.totalRooms; i++) {
      physicalRoomsToCreate.push({
        roomNumber: `${roomNumberPrefix}-${String(i).padStart(3, '0')}`,
        roomType: room._id,
        status: 'available',
      });
    }
    await PhysicalRoom.insertMany(physicalRoomsToCreate);

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create room', error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update room', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut are required' });
    }

    const roomQuery = { isActive: true };
    if (guests) roomQuery.capacity = { $gte: Number(guests) };

    const allRoomTypes = await Room.find(roomQuery);
    const availableRoomTypes = [];

    for (const roomType of allRoomTypes) {
      const physicalRooms = await PhysicalRoom.find({
        roomType: roomType._id,
        status: { $ne: 'maintenance' },
      });

      const hasFreeRoom = await Promise.all(
        physicalRooms.map(async (pr) => {
          const overlap = await Booking.findOne({
            physicalRoom: pr._id,
            status: { $in: ['pending', 'confirmed', 'checked-in'] },
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) },
          });
          return !overlap;
        })
      );

      if (hasFreeRoom.includes(true)) {
        availableRoomTypes.push(roomType);
      }
    }

    res.status(200).json(availableRoomTypes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to check availability', error: error.message });
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms };