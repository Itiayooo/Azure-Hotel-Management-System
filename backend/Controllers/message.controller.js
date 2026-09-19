const Message = require('../Models/message.model.js');

const getMyMessages = async (req, res) => {
    try {
        const messages = await Message.find({ customer: req.user.id }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = await Message.create({
            customer: req.user.id,
            sender: 'customer',
            text,
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Failed to send message', error: error.message });
    }
};

// GET /api/messages/threads (admin — list of customers who have messages, with latest message preview)
const getAllThreads = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });

        const threadsMap = new Map();

        for (const msg of messages) {
            const customerId = msg.customer?._id?.toString();
            if (!customerId) continue;

            if (!threadsMap.has(customerId)) {
                threadsMap.set(customerId, {
                    customer: msg.customer,
                    lastMessage: msg.text,
                    lastMessageAt: msg.createdAt,
                    hasUnread: false,
                });
            }

            if (msg.sender === 'customer' && !msg.isRead) {
                threadsMap.get(customerId).hasUnread = true;
            }
        }

        res.status(200).json(Array.from(threadsMap.values()));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch threads', error: error.message });
    }
};

const getThreadByCustomer = async (req, res) => {
    try {
        const messages = await Message.find({ customer: req.params.customerId }).sort({ createdAt: 1 });

        // Mark customer's messages as read once admin opens the thread
        await Message.updateMany(
            { customer: req.params.customerId, sender: 'customer', isRead: false },
            { isRead: true }
        );

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch thread', error: error.message });
    }
};

const replyToMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = await Message.create({
            customer: req.params.customerId,
            sender: 'admin',
            text,
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Failed to send reply', error: error.message });
    }
};

module.exports = { getMyMessages, sendMessage, getAllThreads, getThreadByCustomer, replyToMessage };