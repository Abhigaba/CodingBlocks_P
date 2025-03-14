const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {getAgentId, getChatHistory} = require('../helper/chatHelper')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3002;

// In-memory session storage
const sessions = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Start a new chat session
  socket.on('startChat', async (userId) => {
    const agent = getAgentId();
    sessions.set(userId, { agent });

    // Join rooms for user and agent
    socket.join(userId);
    socket.join(agent);

    // Send chat history to the user
    const history = await getChatHistory(userId);
    socket.emit('chatHistory', history);
  });

  // Handle incoming messages
  socket.on('sendMessage', async ({ userId, message }) => {
    const session = sessions.get(userId);
    if (session) {
      const { agent } = session;

      // Save message to database
      await ChatController.saveMessage(userId, agent, message);

      // Broadcast message to user and agent
      io.to(userId).emit('receiveMessage', { sender: 'user', message });
      io.to(agent).emit('receiveMessage', { sender: 'user', message });
    }
  });

  // Handle agent replies
  socket.on('agentReply', async ({ userId, message }) => {
    const session = sessions.get(userId);
    if (session) {
      const { agent } = session;

      // Save message to database
      await ChatController.saveMessage(userId, agent, message);

      // Broadcast message to user and agent
      io.to(userId).emit('receiveMessage', { sender: 'agent', message });
      io.to(agent).emit('receiveMessage', { sender: 'agent', message });
    }
  });

  // End chat session
  socket.on('endChat', (userId) => {
    sessions.delete(userId);
    console.log(`Chat session ended for user: ${userId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});