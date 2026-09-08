require('dotenv').config();
const mongoose = require("mongoose")

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        if (connection) {
            console.log("Database connected successfully");            
        }
    } catch (error) {
        console.log(error);        
    }
}

module.exports = connect