const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const connect = require("./Database/db.connect")
const roomRoutes = require("./Routes/room.routes");
const authRoutes = require("./Routes/auth.routes");
const physicalRoomRoutes = require("./Routes/physicalRoom.routes");
const bookingRoutes = require("./Routes/booking.routes");
const testimonialRoutes = require("./Routes/testimonial.routes");
const contactRoutes = require("./Routes/contact.routes");
const userRoutes = require("./Routes/user.routes");
const reviewRoutes = require("./Routes/review.routes");
const subscriberRoutes = require("./Routes/subscriber.routes");
const messageRoutes = require("./Routes/message.routes");
const adminRoutes = require("./Routes/admin.routes");


// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use('/api/physical-rooms', physicalRoomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

connect()
const port = 8006
app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
