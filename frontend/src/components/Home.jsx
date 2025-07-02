import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    if (!roomId || !username) return alert("Room ID & Username required");
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const createRoom = () => {
    const id = uuidv4();
    setRoomId(id);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">DevCollab 💻</h1>
      <input
        className="mb-3 px-4 py-2 rounded bg-gray-800 text-white w-full max-w-md"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        className="mb-3 px-4 py-2 rounded bg-gray-800 text-white w-full max-w-md"
        placeholder="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          onClick={handleJoin}
        >
          Join Room
        </button>
        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={createRoom}
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default Home;