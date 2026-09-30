const Room = require('../Models/room.model.js');
const PhysicalRoom = require('../Models/physicalRooms.model.js');
const Booking = require('../Models/booking.model.js');
const Message = require('../Models/message.model.js');
const Task = require('../Models/task.model.js')
const { autoCheckoutPastBookings } = require('./booking.controller.js');

const autoCheckoutPastBookings = async () => {
    const now = new Date();

    // Guests who checked in but never checked out, past their checkout date
    const overdueCheckouts = await Booking.find({
        status: 'checked-in',
        checkOut: { $lt: now },
        isOverdue: { $ne: true },
    });

    for (const booking of overdueCheckouts) {
        booking.isOverdue = true;
        await booking.save();
    }

    // Guests who were confirmed but never checked in, past their check-in date
    const noShows = await Booking.find({
        status: 'confirmed',
        checkIn: { $lt: now },
    });

    for (const booking of noShows) {
        booking.status = 'no-show';
        await booking.save();
    }

    return overdueCheckouts.length + noShows.length;
};

const getDashboardStats = async (req, res) => {
    await autoCheckoutPastBookings();
    try {
        const since = getRangeStart(req.query.range);
        const now = new Date();

        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setUTCHours(23, 59, 59, 999);

        // New bookings created in the range (cancelled ones excluded)
        const newBookingsQuery = { status: { $ne: 'cancelled' } };
        if (since) newBookingsQuery.createdAt = { $gte: since };
        const newBookings = await Booking.countDocuments(newBookingsQuery);


        const checkInQuery = { status: { $in: ['checked-in', 'checked-out'] } };
        if (since) {
            checkInQuery.$or = [
                { checkedInAt: { $gte: since, $lte: now } },
                { checkedInAt: { $exists: false }, checkIn: { $gte: since, $lte: endOfToday } },
            ];
        }
        const checkIns = await Booking.countDocuments(checkInQuery);

        const checkOutQuery = { status: 'checked-out' };
        if (since) {
            checkOutQuery.$or = [
                { checkedOutAt: { $gte: since, $lte: now } },
                { checkedOutAt: { $exists: false }, checkOut: { $gte: since, $lte: endOfToday } },
            ];
        }
        const checkOuts = await Booking.countDocuments(checkOutQuery);

        const revenueMatch = { paymentStatus: 'paid', status: { $ne: 'cancelled' } };
        if (since) revenueMatch.createdAt = { $gte: since };
        const revenueResult = await Booking.aggregate([
            { $match: revenueMatch },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const [totalRooms, occupiedRooms, maintenanceRooms, availableRaw] = await Promise.all([
            PhysicalRoom.countDocuments(),
            PhysicalRoom.countDocuments({ status: 'occupied' }),
            PhysicalRoom.countDocuments({ status: 'maintenance' }),
            PhysicalRoom.countDocuments({ status: 'available' }),
        ]);

        const reservedIds = await Booking.distinct('physicalRoom', {
            status: 'confirmed',
            checkIn: { $lte: endOfToday },
            checkOut: { $gt: startOfToday },
        });
        const reservedRooms = await PhysicalRoom.countDocuments({
            _id: { $in: reservedIds },
            status: 'available',
        });

        const activeBookings = await Booking.countDocuments({
            status: { $in: ['pending', 'confirmed', 'checked-in'] },
        });

        res.status(200).json({
            range: req.query.range || 'all',
            newBookings,
            checkIns,
            checkOuts,
            totalRevenue,
            totalRooms,
            activeBookings,
            occupiedRooms,
            reservedRooms,
            maintenanceRooms,
            availableRooms: availableRaw - reservedRooms,
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
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
            { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const byMonth = byMonthRaw.map((m) => ({
            month: monthNames[m._id - 1],
            count: m.count,
        }));

        const byRoomTypeRaw = await Booking.aggregate([
            {
                $match: {
                    status: {
                        $ne: 'cancelled'
                    }
                }
            },
            {
                $group: {
                    _id: '$roomType',
                    count: { $sum: 1 }
                }
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



