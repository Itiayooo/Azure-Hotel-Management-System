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

module.exports = { getMyMessages, sendMessage };