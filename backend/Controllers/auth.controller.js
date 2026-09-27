const jwt = require('jsonwebtoken');
const User = require('../Models/user.model.js')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await User.create({ name, email, phone, password });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
        console.error(error);
    }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 min
        await user.save();
        
        const resetUrl = `https://grandazure.vercel.app/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Reset your Grand Azure password',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Grand Azure Hotel</h2>
          <p>You requested a password reset. This link expires in 30 minutes:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
        });

        res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process request', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
        console.log(error);

    }
};

const googleLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;

        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { email, name } = googleRes.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                authProvider: 'google',
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(401).json({ message: 'Google sign-in failed', error: error.message });
    }
};

module.exports = { register, login, googleLogin, forgotPassword, resetPassword };