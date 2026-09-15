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

        res.status(201).json(booking);
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

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
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
        const { reference, guestDetails, room, checkIn, checkOut, totalPrice } = req.body;

        if (!guestDetails?.email) {
            return res.status(400).json({ message: 'No recipient email provided' });
        }

        const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Grand Azure Hotel</h2>
        <p>Official Booking Receipt</p>
        <p style="color: #888;">Reference: #${reference}</p>
        <hr />
        <p><strong>Guest Name:</strong> ${guestDetails.firstName} ${guestDetails.lastName}</p>
        <p><strong>Room Reserved:</strong> ${room?.name}</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Total Amount Paid:</strong> ₦${Number(totalPrice).toLocaleString()}</p>
        <hr />
        <p>Thank you for choosing Grand Azure Hotel & Suites.</p>
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

module.exports = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    cancelBooking,
    sendReceiptEmail, 
};
