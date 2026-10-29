// Controllers/contact.controller.js
const Contact = require('../Models/contact.model.js');
const sendEmail = require('../Utils/sendEmail.js');

// Stops visitor-typed text from being treated as HTML inside the email
const escapeHtml = (str = '') =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// POST /api/contact
const createContactMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        const contact = await Contact.create({ firstName, lastName, email, phone, message });

        // The enquiry is already saved, so a failed email must not fail the request
        try {
            await sendEmail({
                to: process.env.HOTEL_EMAIL || process.env.BREVO_SENDER_EMAIL,
                replyTo: email, // hitting Reply in the inbox writes straight to the guest
                subject: `New enquiry from ${firstName} ${lastName}`,
                html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #8C6D46; padding: 20px; color: white;">
              <h2 style="margin: 0; font-weight: 500;">New website enquiry</h2>
            </div>
            <div style="padding: 24px; color: #333; font-size: 14px; line-height: 1.6;">
              <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone) || 'Not provided'}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #FAF9F6; padding: 12px; border-radius: 8px;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
            });
        } catch (emailError) {
            console.error('Contact notification email failed:', emailError.message);
        }

        res.status(201).json({ message: 'Enquiry sent successfully', contact });
    } catch (error) {
        res.status(400).json({ message: 'Failed to send enquiry', error: error.message });
    }
};

// GET /api/contact (admin)
const getAllContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
    }
};

module.exports = { createContactMessage, getAllContactMessages };