import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8006/api/rooms/${id}`);
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading room...</div>;
  if (!room) return <div className="p-8 text-center">Room not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-medium text-gray-900 mb-2">{room.name}</h1>
      <p className="text-gray-600 mb-6">{room.description}</p>

      {/* Features */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Features</h3>
        <ul className="list-disc pl-5">
          {room.features?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Facilities */}
      <div>
        <h3 className="text-xl font-medium mb-2">Facilities</h3>
        <div className="grid grid-cols-2 gap-2">
          {room.facilities?.map((item, idx) => (
            <div key={idx} className="p-2 bg-gray-100 rounded">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;