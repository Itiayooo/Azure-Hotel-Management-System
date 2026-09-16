const Contact = require('../Models/contact.model.js');

const createContactMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        const contact = await Contact.create({ firstName, lastName, email, phone, message });

        res.status(201).json({ message: 'Enquiry sent successfully', contact });
    } catch (error) {
        res.status(400).json({ message: 'Failed to send enquiry', error: error.message });
    }
};

// For admin page
const getAllContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
    }
};

module.exports = { createContactMessage, getAllContactMessages };