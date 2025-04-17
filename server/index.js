// File: server/index.js
// Version: v1.1
// Updated: 2025-04-17 – Aligns with Socket.IO media-enabled chat.js
// Created by: Jayson Gilbertson

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads/messages')));

// === In-memory store (swap with DB later) ===
let messages = [];

// === Socket.IO events ===
io.on('connection', socket => {
  console.log('🟢 Client connected:', socket.id);

  // Send message history on connect
  socket.emit('chat message', { system: true, text: 'Connected to PW Chat Server ✅' });
  messages.forEach(msg => socket.emit('chat message', msg));

  // Handle incoming chat message
  socket.on('chat message', data => {
    const message = {
      id: Date.now(),
      sender: data.sender || 'Anonymous',
      text: data.text || '',
      media: data.media || '',
      timestamp: new Date().toISOString()
    };

    messages.push(message);
    io.emit('chat message', message); // Broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 PW Chat Server running at http://localhost:${PORT}`);
});
