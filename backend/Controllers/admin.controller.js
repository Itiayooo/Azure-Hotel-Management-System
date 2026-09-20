const Room = require('../Models/room.model.js');
const PhysicalRoom = require('../Models/physicalRooms.model.js');
const Booking = require('../Models/booking.model.js');

const getDashboardStats = async (req, res) => {
    try {
        const totalRooms = await PhysicalRoom.countDocuments();
        const availableRooms = await PhysicalRoom.countDocuments({ status: 'available' });
        const occupiedRooms = await PhysicalRoom.countDocuments({ status: 'occupied' });
        const maintenanceRooms = await PhysicalRoom.countDocuments({ status: 'maintenance' });

        const activeBookings = await Booking.countDocuments({
            status: { $in: ['pending', 'confirmed', 'checked-in'] },
        });

        const totalCheckIns = await Booking.countDocuments({
            status: { $in: ['checked-in', 'checked-out'] },
        });

        const totalCheckOuts = await Booking.countDocuments({ status: 'checked-out' });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todaysCheckIns = await Booking.countDocuments({
            checkIn: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['confirmed', 'checked-in'] },
        });

        const todaysCheckOuts = await Booking.countDocuments({
            checkOut: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['checked-in', 'checked-out'] },
        });

        const revenueResult = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.status(200).json({
            totalRooms,
            availableRooms,
            occupiedRooms,
            maintenanceRooms,
            activeBookings,
            totalCheckIns,
            totalCheckOuts,
            todaysCheckIns,
            todaysCheckOuts,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
    }
};

module.exports = { getDashboardStats };