const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const connect = require("./Database/db.connect")

// MIDDLEWARES
app.use(cors())
app.use(express.json())
const roomRoutes = require("./Routes/room.routes");
const authRoutes = require("./Routes/auth.routes");
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

connect()
const port = 8006
app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
