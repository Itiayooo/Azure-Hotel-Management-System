const Subscriber = require('../Models/subscriber.model.js');
const sendEmail = require('../Utils/sendEmail.js');

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'This email is already subscribed' });
        }

        await Subscriber.create({ email });

        await sendEmail({
            to: email,
            subject: 'Welcome to Grand Azure Hotel Newsletter',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #8C6D46; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; font-weight: 500;">Grand Azure Hotel</h2>
          </div>
          <div style="padding: 24px; color: #333; font-size: 14px; line-height: 1.6;">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll be the first to know about exclusive offers, new experiences, and updates from Grand Azure Hotel & Suites.</p>
          </div>
          <div style="background-color: #FAF9F6; padding: 16px; text-align: center; font-size: 12px; color: #999;">
            Grand Azure Hotel & Suites
          </div>
        </div>
      `,
        });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to subscribe', error: error.message });
    }
};

module.exports = { subscribe };