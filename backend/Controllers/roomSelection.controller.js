const mongoose = require('mongoose');
const Booking = require('../Models/booking.model.js');
const PhysicalRoom = require('../Models/physicalRoom.model.js');
const RoomHold = require('../Models/roomHold.model.js');
const RoomChange = require('../Models/roomChange.model.js');
const User = require('../Models/user.model.js');
const sendEmail = require('../Utils/sendEmail.js');
const { hasPermission } = require('../Utils/permissions.js');
const {
  getBookedRoomIds,
  getHeldRoomIds,
  isRoomFree,
  withRoomLock,
} = require('../Utils/roomAvailability.js');

const HOLD_MINUTES = 10;

const validDates = (checkIn, checkOut) =>
  checkIn &&
  checkOut &&
  !isNaN(new Date(checkIn)) &&
  !isNaN(new Date(checkOut)) &&
  new Date(checkOut) > new Date(checkIn);

const escapeHtml = (str = '') =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// GET /api/room-selection/map?roomTypeId=&checkIn=&checkOut=&holderId=&excludeBookingId=
// Every room of a type with its state for the dates: available, taken, held, maintenance
const getRoomMap = async (req, res) => {
  try {
    const { roomTypeId, checkIn, checkOut, holderId, excludeBookingId } = req.query;

    if (!mongoose.isValidObjectId(roomTypeId) || !validDates(checkIn, checkOut)) {
      return res.status(400).json({ message: 'roomTypeId, checkIn and checkOut are required' });
    }

    const rooms = await PhysicalRoom.find({ roomType: roomTypeId }).sort({ roomNumber: 1 });
    const ids = rooms.map((r) => r._id);
    const excludeId = mongoose.isValidObjectId(excludeBookingId) ? excludeBookingId : null;

    const [booked, held, mineIds] = await Promise.all([
      getBookedRoomIds(ids, checkIn, checkOut, excludeId),
      getHeldRoomIds(ids, checkIn, checkOut, holderId),
      holderId
        ? RoomHold.distinct('physicalRoom', {
          holderId,
          physicalRoom: { $in: ids },
          expiresAt: { $gt: new Date() },
        })
        : [],
    ]);
    const mine = new Set(mineIds.map(String));

    // When changing an existing booking, mark the room it's in right now
    let currentRoomId = null;
    if (excludeId) {
      const existing = await Booking.findById(excludeId).select('physicalRoom');
      currentRoomId = existing ? String(existing.physicalRoom) : null;
    }

    const map = rooms.map((r) => {
      const id = String(r._id);
      let state = 'available';
      if (r.status === 'maintenance') state = 'maintenance';
      else if (booked.has(id)) state = 'taken';
      else if (held.has(id)) state = 'held';
      return {
        _id: r._id,
        roomNumber: r.roomNumber,
        state,
        mine: mine.has(id),
        current: id === currentRoomId,
      };
    });

    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load room map', error: error.message });
  }
};

// POST /api/room-selection/hold
// Holds one room for a guest for a few minutes. One hold per guest at a time.
const holdRoom = async (req, res) => {
  try {
    const { physicalRoomId, checkIn, checkOut, holderId } = req.body;

    if (!mongoose.isValidObjectId(physicalRoomId) || !holderId || !validDates(checkIn, checkOut)) {
      return res.status(400).json({ message: 'physicalRoomId, holderId, checkIn and checkOut are required' });
    }

    const room = await PhysicalRoom.findById(physicalRoomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const free = await isRoomFree(room, checkIn, checkOut, { holderId });
    if (!free) {
      return res.status(409).json({ message: 'That room was just taken. Please pick another one.' });
    }

    await RoomHold.deleteMany({ holderId });

    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
    await RoomHold.create({
      physicalRoom: room._id,
      roomType: room.roomType,
      holderId,
      checkIn,
      checkOut,
      expiresAt,
    });

    res.status(200).json({ expiresAt });
  } catch (error) {
    res.status(500).json({ message: 'Failed to hold room', error: error.message });
  }
};

// DELETE /api/room-selection/hold/:holderId
const releaseHold = async (req, res) => {
  try {
    await RoomHold.deleteMany({ holderId: req.params.holderId });
    res.status(200).json({ message: 'Hold released' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to release hold', error: error.message });
  }
};

// PATCH /api/room-selection/change-room/:bookingId
// Guests can move before check-in. Admins can also move a guest who is already checked in.
// Same room type only, so the price never changes.
const changeRoom = async (req, res) => {
  try {
    const { newRoomId } = req.body;

    if (!mongoose.isValidObjectId(newRoomId)) {
      return res.status(400).json({ message: 'A valid newRoomId is required' });
    }

    const booking = await Booking.findById(req.params.bookingId)
      .populate('physicalRoom')
      .populate('roomType', 'name')
      .populate('customer', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isAdmin = hasPermission(req.account, 'bookings.manage');
    const isOwner = booking.customer && String(booking.customer._id) === String(req.user.id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You are not allowed to change this booking' });
    }

    const allowedStatuses = isAdmin ? ['confirmed', 'checked-in'] : ['confirmed'];
    if (!allowedStatuses.includes(booking.status)) {
      return res.status(400).json({
        message: isAdmin
          ? 'Only confirmed or checked-in bookings can change rooms'
          : 'You can only change your room before check-in',
      });
    }

    const oldRoom = booking.physicalRoom;
    const newRoom = await PhysicalRoom.findById(newRoomId);
    if (!newRoom) return res.status(404).json({ message: 'Room not found' });

    if (String(newRoom._id) === String(oldRoom._id)) {
      return res.status(400).json({ message: 'The guest is already in that room' });
    }
    if (String(newRoom.roomType) !== String(booking.roomType._id)) {
      return res.status(400).json({ message: 'You can only switch to a room of the same type' });
    }
    if (booking.status === 'checked-in' && newRoom.status !== 'available') {
      return res.status(409).json({ message: 'That room is not available right now' });
    }

    const outcome = await withRoomLock(newRoom._id, async () => {
      const free = await isRoomFree(newRoom, booking.checkIn, booking.checkOut, {
        excludeBookingId: booking._id,
      });
      if (!free) return false;
      booking.physicalRoom = newRoom._id;
      await booking.save();
      return true;
    });

    if (outcome.locked || !outcome.result) {
      return res.status(409).json({ message: 'That room was just taken. Please pick another one.' });
    }

    // Guest already in the hotel: swap which room counts as occupied
    if (booking.status === 'checked-in') {
      if (oldRoom.status === 'occupied') {
        await PhysicalRoom.findByIdAndUpdate(oldRoom._id, { status: 'available' });
      }
      await PhysicalRoom.findByIdAndUpdate(newRoom._id, { status: 'occupied' });
    }

    const guestName =
      booking.customer?.name ||
      `${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`.trim() ||
      'Guest';
    const actor = await User.findById(req.user.id).select('name');

    await RoomChange.create({
      booking: booking._id,
      reference: booking.paymentReference,
      guestName,
      fromRoomNumber: oldRoom.roomNumber,
      toRoomNumber: newRoom.roomNumber,
      changedBy: req.user.id,
      changedByName: actor?.name || 'Unknown',
      changedByRole: isAdmin ? 'admin' : 'guest',
    });

    // Updated receipt by email. A failed email never undoes the room change.
    let emailSent = false;
    const recipient = booking.guestDetails?.email || booking.customer?.email;
    if (recipient) {
      try {
        const day = (d) => new Date(d).toISOString().split('T')[0];
        await sendEmail({
          to: recipient,
          subject: `Updated receipt: your room has changed (#${booking.paymentReference})`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
              <div style="background-color: #8C6D46; padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0; font-weight: 500;">Grand Azure Hotel</h2>
                <p style="margin: 4px 0 0; font-size: 13px;">Updated Booking Receipt</p>
              </div>
              <div style="padding: 24px; color: #333; font-size: 14px;">
                <p style="font-size: 12px; color: #999; margin-top: 0;">Reference: #${escapeHtml(booking.paymentReference)}</p>
                <p>Hi ${escapeHtml(guestName)}, your room has been changed.</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Room type</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${escapeHtml(booking.roomType.name)}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">New room number</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${escapeHtml(newRoom.roomNumber)}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Previous room</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(oldRoom.roomNumber)}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Check-in</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${day(booking.checkIn)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #777;">Check-out</td><td style="padding: 8px 0; text-align: right;">${day(booking.checkOut)}</td></tr>
                </table>
              </div>
              <div style="background-color: #FAF9F6; padding: 16px; text-align: center; font-size: 12px; color: #999;">
                Grand Azure Hotel & Suites
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Room change email failed:', emailError.message);
      }
    }

    await booking.populate('physicalRoom');
    res.status(200).json({ ...booking.toObject(), emailSent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change room', error: error.message });
  }
};

// GET /api/room-selection/changes (admin)
const getRoomChanges = async (req, res) => {
  try {
    const changes = await RoomChange.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json(changes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch room changes', error: error.message });
  }
};

module.exports = { getRoomMap, holdRoom, releaseHold, changeRoom, getRoomChanges };