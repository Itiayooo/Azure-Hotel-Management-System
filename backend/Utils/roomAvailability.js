const mongoose = require('mongoose');
const Booking = require('../Models/booking.model.js');
const PhysicalRoom = require('../Models/physicalRoom.model.js');
const RoomHold = require('../Models/roomHold.model.js');
const RoomLock = require('../Models/roomLock.model.js');

const ACTIVE_STATUSES = ['pending', 'confirmed', 'checked-in'];

const overlap = (checkIn, checkOut) => ({
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
});

// Which of these rooms already have an active booking overlapping the dates
const getBookedRoomIds = async (roomIds, checkIn, checkOut, excludeBookingId) => {
    const query = {
        physicalRoom: { $in: roomIds },
        status: { $in: ACTIVE_STATUSES },
        ...overlap(checkIn, checkOut),
    };
    if (excludeBookingId) query._id = { $ne: excludeBookingId };
    const ids = await Booking.distinct('physicalRoom', query);
    return new Set(ids.map(String));
};

// Which of these rooms are held by somebody else. Expired holds are ignored even if
// MongoDB hasn't cleaned them up yet (its cleanup runs about once a minute).
const getHeldRoomIds = async (roomIds, checkIn, checkOut, holderId) => {
    const query = {
        physicalRoom: { $in: roomIds },
        expiresAt: { $gt: new Date() },
        ...overlap(checkIn, checkOut),
    };
    if (holderId) query.holderId = { $ne: holderId };
    const ids = await RoomHold.distinct('physicalRoom', query);
    return new Set(ids.map(String));
};

const isRoomFree = async (room, checkIn, checkOut, { excludeBookingId, holderId } = {}) => {
    if (!room || room.status === 'maintenance') return false;
    const booked = await getBookedRoomIds([room._id], checkIn, checkOut, excludeBookingId);
    if (booked.size > 0) return false;
    const held = await getHeldRoomIds([room._id], checkIn, checkOut, holderId);
    return held.size === 0;
};

// First free room of a type, lowest room number first
const findFreeRoom = async (roomTypeId, checkIn, checkOut, holderId, skipIds = []) => {
    const rooms = await PhysicalRoom.find({
        roomType: roomTypeId,
        status: { $ne: 'maintenance' },
        _id: { $nin: skipIds },
    }).sort({ roomNumber: 1 });

    if (rooms.length === 0) return null;

    const ids = rooms.map((r) => r._id);
    const [booked, held] = await Promise.all([
        getBookedRoomIds(ids, checkIn, checkOut),
        getHeldRoomIds(ids, checkIn, checkOut, holderId),
    ]);

    return rooms.find((r) => !booked.has(String(r._id)) && !held.has(String(r._id))) || null;
};

// Runs fn while holding the lock for one room. If someone else holds it, fn doesn't run.
const withRoomLock = async (roomId, fn) => {
    await RoomLock.init(); // makes sure the unique index exists before we rely on it
    try {
        await RoomLock.create({ physicalRoom: roomId });
    } catch (error) {
        if (error.code === 11000) return { locked: true };
        throw error;
    }
    try {
        return { locked: false, result: await fn() };
    } finally {
        await RoomLock.deleteOne({ physicalRoom: roomId });
    }
};

// Picks a room and creates the booking while the room is locked, so the
// "is it free?" check and the insert can't be split by another booking.
// Tries the guest's preferred room first, then any other free room of the same type.
const reserveRoom = async ({ roomTypeId, preferredRoomId, checkIn, checkOut, holderId, createBooking }) => {
    const tried = [];
    let reassigned = false;

    const tryRoom = async (room) => {
        const outcome = await withRoomLock(room._id, async () => {
            const free = await isRoomFree(room, checkIn, checkOut, { holderId });
            if (!free) return null;
            return createBooking(room);
        });
        if (outcome.locked) return null;
        return outcome.result;
    };

    if (preferredRoomId) {
        if (mongoose.isValidObjectId(preferredRoomId)) {
            const preferred = await PhysicalRoom.findOne({ _id: preferredRoomId, roomType: roomTypeId });
            if (preferred) {
                const booking = await tryRoom(preferred);
                if (booking) return { booking, reassigned: false };
            }
        }
        reassigned = true; // they asked for a room and didn't get it
        tried.push(preferredRoomId);
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        const room = await findFreeRoom(roomTypeId, checkIn, checkOut, holderId, tried);
        if (!room) return null;
        const booking = await tryRoom(room);
        if (booking) return { booking, reassigned };
        tried.push(room._id);
    }

    return null;
};

module.exports = {
    ACTIVE_STATUSES,
    getBookedRoomIds,
    getHeldRoomIds,
    isRoomFree,
    findFreeRoom,
    withRoomLock,
    reserveRoom,
};