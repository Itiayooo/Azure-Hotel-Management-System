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
        features: [
            'Super King-size bed with premium plush linens',
            'Ensuite luxury bathroom with Jacuzzi and rain shower',
            'Private living room and formal dining space',
            'Air conditioning & automated blackout blinds',
            '24/7 Dedicated butler service',
            'Daily VIP housekeeping & evening turn-down service'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Coffee Maker',
            'Fridge',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789045876/Presidential_suite_i_zukwwc.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045876/Presidential_suite_ii_w0zs6s.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045876/Presidentail_suite_iii_qxwwsw.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045875/Presidential_suite_iv_sal32p.jpg"
        ],
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
        features: [
            'King-size bed with luxury linens',
            'Ensuite bathroom with rain shower',
            'Separate living area with workspace',
            'Air conditioning & blackout curtains',
            'Complimentary high-speed Wi-Fi',
            'Daily housekeeping'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Coffee Maker',
            'Fridge',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789045961/Executive_suite_i_v4of4f.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045960/Executive_suite_ii_imzuy7.jpg"
        ],
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
        features: [
            'King-size bed with premium linens',
            'Ensuite bathroom with rain shower',
            'Dedicated work desk and seating area',
            'Air conditioning & blackout curtains',
            'Complimentary high-speed Wi-Fi',
            'Daily housekeeping'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Coffee Maker',
            'Fridge',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789046081/Deluxe_room_i_sqvui7.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045960/Executive_suite_ii_imzuy7.jpg"
        ],
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
        features: [
            'Queen-size bed with soft linens',
            'Ensuite modern shower room',
            'Ergonomic work desk setup',
            'Air conditioning & blackout curtains',
            'Complimentary high-speed Wi-Fi',
            'Daily housekeeping'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Coffee Maker',
            'Fridge',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789046057/Premium_room_i_xparvl.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789046054/Premium_room_ii_zcf5g7.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789046053/Premium_room_iii_hirvn2.jpg"
        ],
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
        features: [
            'Queen-size bed with crisp linens',
            'Ensuite bathroom with modern shower',
            'Compact work station',
            'Air conditioning & blackout curtains',
            'Complimentary high-speed Wi-Fi',
            'Daily housekeeping'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Coffee Maker',
            'Fridge',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789046053/Premium_room_iii_hirvn2.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789045986/Standard_room_ii_os1xxa.jpg"
        ],
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
        features: [
            'Double bed with comfortable bedding',
            'Clean ensuite bathroom with shower',
            'Air conditioning',
            'Complimentary Wi-Fi',
            'Daily housekeeping'
        ],
        facilities: [
            'High-Speed Wi-Fi',
            'Air Condition',
            'Big Screen Smart Tv',
            'In-Room Safe'
        ],
        images: [
            "https://res.cloudinary.com/itiayo/image/upload/v1789046106/Classic_room_ii_ils51i.jpg",
            "https://res.cloudinary.com/itiayo/image/upload/v1789046108/Classic_room_i_vylmp2.jpg"            
        ],
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