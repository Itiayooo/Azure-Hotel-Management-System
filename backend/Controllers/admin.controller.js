const Room = require('../Models/room.model.js');
const PhysicalRoom = require('../Models/physicalRooms.model.js');
const Booking = require('../Models/booking.model.js');
const Message = require('../Models/message.model.js');
const Task = require('../Models/task.model.js')

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

const getBookingStats = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const byMonthRaw = await Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const byMonth = byMonthRaw.map((m) => ({
            month: monthNames[m._id - 1],
            count: m.count,
        }));

        const byRoomTypeRaw = await Booking.aggregate([
            {
                $group: {
                    _id: '$roomType',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'roomInfo',
                },
            },
            { $unwind: '$roomInfo' },
            {
                $project: {
                    _id: 0,
                    name: '$roomInfo.name',
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);

        res.status(200).json({ byMonth, byRoomType: byRoomTypeRaw });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch booking stats', error: error.message });
    }
};

const getNotificationSummary = async (req, res) => {
    try {
        const unreadMessagesCount = await Message.countDocuments({
            sender: 'customer',
            isRead: false,
        });

        const user = await require('../Models/user.model.js').findById(req.user.id);
        const lastViewed = user.lastViewedTasksAt || new Date(0);

        const newTasksCount = await Task.countDocuments({
            createdAt: { $gt: lastViewed },
            postedBy: { $ne: req.user.id },
        });

        res.status(200).json({ unreadMessagesCount, newTasksCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
};

const markTasksViewed = async (req, res) => {
    try {
        await require('../Models/user.model.js').findByIdAndUpdate(req.user.id, {
            lastViewedTasksAt: new Date(),
        });
        res.status(200).json({ message: 'Marked as viewed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update', error: error.message });
    }
};

module.exports = { getDashboardStats, getBookingStats, getNotificationSummary, markTasksViewed };



