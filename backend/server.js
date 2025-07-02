import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import Code from './models/Code.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('DevCollab Backend is Running');
});

// Save or Update Code
app.post('/api/code', async (req, res) => {
  const { roomId, code } = req.body;
  if (!roomId || !code) return res.status(400).send('Missing roomId or code');

  try {
    const existing = await Code.findOne({ roomId });
    if (existing) {
      existing.code = code;
      await existing.save();
      return res.json({ message: 'Code updated' });
    }
    await Code.create({ roomId, code });
    res.status(201).json({ message: 'Code saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Load Code
app.get('/api/code/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const found = await Code.findOne({ roomId });
    if (!found) return res.json({ code: '' });
    res.json({ code: found.code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.IO setup
io.on('connection', (socket) => {
  socket.on('join', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', code);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));