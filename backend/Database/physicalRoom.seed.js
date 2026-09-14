// Database/physicalRoom.seed.js
const connect = require('./db.connect.js');
const Room = require('../Models/room.model.js');
const PhysicalRoom = require('../Models/physicalRoom.model.js');

const roomConfig = [
  { name: 'Presidential Suite', prefix: 'PRES', count: 2 },
  { name: 'Executive Suite', prefix: 'EXEC', count: 6 },
  { name: 'Deluxe Room', prefix: 'DLX', count: 14 },
  { name: 'Premium Room', prefix: 'PREM', count: 18 },
  { name: 'Standard Room', prefix: 'STD', count: 28 },
  { name: 'Classic Room', prefix: 'CLSC', count: 12 },
];

const seedPhysicalRooms = async () => {
  try {
    await connect();

    const physicalRooms = [];

    for (const config of roomConfig) {
      const room = await Room.findOne({ name: config.name });
      if (!room) {
        console.warn(`⚠️ Room type "${config.name}" not found — skipping`);
        continue;
      }

      for (let i = 1; i <= config.count; i++) {
        const roomNumber = `${config.prefix}-${String(i).padStart(3, '0')}`;
        physicalRooms.push({
          roomNumber,
          roomType: room._id,
          status: 'available',
        });
      }
    }

    await PhysicalRoom.deleteMany();
    await PhysicalRoom.insertMany(physicalRooms);

    console.log(`Seeded ${physicalRooms.length} physical rooms`);
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedPhysicalRooms();