const axios = require('axios');
const Booking = require('../Models/booking.model.js');
const PhysicalRoom = require("../Models/physicalRooms.model.js")
const sendEmail = require('../Utils/sendEmail.js');

// Find a physical room of the given type that has no overlapping booking
const findAvailablePhysicalRoom = async (roomTypeId, checkIn, checkOut) => {
    const physicalRooms = await PhysicalRoom.find({
        roomType: roomTypeId,
        status: { $ne: 'maintenance' },
    });

    for (const room of physicalRooms) {
        const overlapping = await Booking.findOne({
            physicalRoom: room._id,
            status: { $in: ['pending', 'confirmed', 'checked-in'] },
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) },
        });

        if (!overlapping) return room;
    }

    return null;
};

const createBooking = async (req, res) => {
    try {
        const {
            roomType,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            paymentReference,
            guestDetails,
        } = req.body;

        const paystackRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${paymentReference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const paymentData = paystackRes.data.data;

        if (paymentData.status !== 'success') {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const physicalRoom = await findAvailablePhysicalRoom(roomType, checkIn, checkOut);

        if (!physicalRoom) {
            return res.status(400).json({ message: 'No rooms of this type available for the selected dates' });
        }

        // const booking = await Booking.create({
        //     customer: req.user ? req.user.id : null,
        //     roomType,
        //     physicalRoom: physicalRoom._id,
        //     checkIn,
        //     checkOut,
        //     guests,
        //     totalPrice,
        //     status: 'confirmed',
        //     paymentStatus: 'paid',
        //     paymentReference,
        //     guestDetails,
        // });

        // res.status(201).json(booking);

        const booking = await Booking.create({
            customer: req.user ? req.user.id : null,
            roomType,
            physicalRoom: physicalRoom._id,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentReference,
            guestDetails,
        });

        const populatedBooking = await booking.populate('physicalRoom');

        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
        console.log(error.message);

    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('roomType')
            .populate('physicalRoom')
            .populate('customer', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id })
            .populate('roomType')
            .populate('physicalRoom');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your bookings', error: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('roomType')
            .populate('physicalRoom')
            .populate('customer', 'name email');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
    }
};

const verifyBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            paymentReference: req.params.reference,
        })
            .populate('roomType')
            .populate('physicalRoom');

        if (!booking) {
            return res.status(404).json({
                valid: false,
                message: 'Booking not found',
            });
        }

        res.status(200).json({
            valid: booking.paymentStatus === 'paid' && booking.status !== 'cancelled',
            booking: {
                reference: booking.paymentReference,
                guestName: `${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`.trim(),
                roomName: booking.roomType?.name,
                roomNumber: booking.physicalRoom?.roomNumber,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
            },
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Failed to verify booking',
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const isOwner = booking.customer && booking.customer.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        if (booking.status === 'checked-in' || booking.status === 'checked-out') {
            return res.status(400).json({ message: 'Cannot cancel a booking already in progress or completed' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
    }
};

const sendReceiptEmail = async (req, res) => {
    try {
        const { reference, guestDetails, room, roomNumber, checkIn, checkOut, totalPrice } = req.body;

        if (!guestDetails?.email) {
            return res.status(400).json({ message: 'No recipient email provided' });
        }

        const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #8C6D46; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-weight: 500;">Grand Azure Hotel</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Official Booking Receipt</p>
        </div>
        <div style="padding: 24px; color: #333;">
          <p style="font-size: 12px; color: #999; margin-top: 0;">Reference: #${reference}</p>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Guest Name</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${guestDetails.firstName} ${guestDetails.lastName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Room Reserved</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${room?.name}</td></tr>
            ${roomNumber ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Room Number</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${roomNumber}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Check-In</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${checkIn}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #777;">Check-Out</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${checkOut}</td></tr>
            <tr><td style="padding: 12px 0 0; color: #777;">Total Amount Paid</td><td style="padding: 12px 0 0; text-align: right; font-weight: 700; font-size: 16px; color: #8C6D46;">₦${Number(totalPrice).toLocaleString()}</td></tr>
          </table>
        </div>
        <div style="background-color: #FAF9F6; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          Thank you for choosing Grand Azure Hotel & Suites.
        </div>
      </div>
    `;

        await sendEmail({
            to: guestDetails.email,
            subject: `Your Grand Azure Booking Receipt (#${reference})`,
            html,
        });

        res.status(200).json({ message: 'Receipt email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send receipt email', error: error.message });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: `Cannot confirm a booking with status "${booking.status}"` });
        }
        booking.status = 'confirmed';
        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm booking', error: error.message });
    }
};

const checkInBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status !== 'confirmed') {
            return res.status(400).json({ message: `Cannot check in a booking with status "${booking.status}"` });
        }
        booking.status = 'checked-in';
        await booking.save();

        await PhysicalRoom.findByIdAndUpdate(booking.physicalRoom, { status: 'occupied' });

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to check in booking', error: error.message });
    }
};


const checkOutBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status !== 'checked-in') {
            return res.status(400).json({ message: `Cannot check out a booking with status "${booking.status}"` });
        }
        booking.status = 'checked-out';
        await booking.save();

        await PhysicalRoom.findByIdAndUpdate(booking.physicalRoom, { status: 'available' });

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to check out booking', error: error.message });
    }
};


module.exports = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    verifyBooking,
    cancelBooking,
    sendReceiptEmail,
    confirmBooking,
    checkInBooking,
    checkOutBooking,
    cancelBooking
};
