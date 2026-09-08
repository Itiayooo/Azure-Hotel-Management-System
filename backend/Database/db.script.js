const connect = require("./db.connect.js");
const Room = require("../Models/room.model.js");

const roomTypes = [
    {
        name: 'Presidential Suite',
        description: 'The ultimate expression of luxury and exclusivity, offering expansive living spaces, refined furnishings, premium amenities, and exceptional comfort, privacy, and sophistication.',
        pricePerNight: 750000,
        capacity: 4,
        bedType: 'King',
        roomSize: '120 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Private Living Room', 'Jacuzzi', '24/7 Room Service'],
        totalRooms: 2,
    },
    {
        name: 'Executive Suite',
        description: 'Designed for space, comfort, and convenience, featuring an elegant bedroom, separate living area, and premium amenities for business, VIP, or extended stays.',
        pricePerNight: 450000,
        capacity: 3,
        bedType: 'King',
        roomSize: '85 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Living Room', '24/7 Room Service'],
        totalRooms: 6,
    },
    {
        name: 'Deluxe Room',
        description: 'A spacious and beautifully appointed room offering enhanced comfort, modern amenities, and a relaxing retreat for a memorable stay.',
        pricePerNight: 280000,
        capacity: 2,
        bedType: 'King',
        roomSize: '50 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Work Desk'],
        totalRooms: 14,
    },
    {
        name: 'Premium Room',
        description: 'A contemporary and comfortable room with thoughtful amenities, elegant design, and an elevated experience without the extravagance of a suite.',
        pricePerNight: 210000,
        capacity: 2,
        bedType: 'Queen',
        roomSize: '42 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Work Desk'],
        totalRooms: 18,
    },
    {
        name: 'Standard Room',
        description: 'A comfortable and practical room offering essential amenities, quality furnishings, and a cozy environment for a pleasant stay.',
        pricePerNight: 150000,
        capacity: 2,
        bedType: 'Queen',
        roomSize: '35 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk'],
        totalRooms: 28,
    },
    {
        name: 'Classic Room',
        description: 'A comfortable and welcoming room providing essential amenities, clean design, and simple, affordable accommodation for a relaxing stay.',
        pricePerNight: 100000,
        capacity: 2,
        bedType: 'Double',
        roomSize: '30 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV'],
        totalRooms: 12,
    },
];

const seedRooms = async () => {
    try {
        await connect();
        await Room.deleteMany();
        await Room.insertMany(roomTypes);
        console.log('Room types seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedRooms();