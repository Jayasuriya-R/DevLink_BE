const socket = require("socket.io");
const mongoose = require('mongoose'); // ✅ Add mongoose import
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ User connected with socket ID:', socket.id);

    socket.on('register', ({ userId }) => {
      socket.userId = userId;
      connectedUsers.set(userId, socket.id);
      console.log(`👤 User registered: ${userId}`);
    });

    socket.on('sendMessage', async ({ currentUserId, targetUserId, newMsg, firstName }) => {
      console.log('📨 Received sendMessage:', { currentUserId, targetUserId, newMsg, firstName });
      
      const targetSocketId = connectedUsers.get(targetUserId);

      try {
        // ✅ Convert string IDs to ObjectIds
        const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
        const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);

        console.log('🔍 Searching for chat between:', currentUserId, 'and', targetUserId);

        // Find existing chat
        let chat = await Chat.findOne({
          participents: { $all: [currentUserObjectId, targetUserObjectId] }
        });

        console.log('🔍 Found existing chat:', chat ? 'YES' : 'NO');

        if (!chat) {
          console.log('➕ Creating new chat...');
          chat = new Chat({
            participents: [currentUserObjectId, targetUserObjectId],
            messages: [],
          });
        }

        // Add message
        chat.messages.push({
          senderId: currentUserObjectId,
          text: newMsg.text,
        });

        // Save to database
        const savedChat = await chat.save();
        console.log('✅ Message saved to DB! Total messages:', savedChat.messages.length);
        console.log('✅ Last message:', savedChat.messages[savedChat.messages.length - 1]);

        // Send confirmation back to sender
        socket.emit('messageSent', {
          success: true,
          messageId: savedChat.messages[savedChat.messages.length - 1]._id
        });

        // If target is online, deliver in real-time
        if (targetSocketId) {
          io.to(targetSocketId).emit('receiveMessage', {
            newMsg: {
              ...newMsg,
              sender: 'them'
            },
            senderId: currentUserId,
            firstName: firstName
          });
          console.log(`✅ Message delivered to ${targetUserId}`);
        } else {
          console.log(`💾 Message saved for offline user: ${targetUserId}`);
        }

      } catch (err) {
        console.error('❌❌❌ Error saving message to database ❌❌❌');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Full error:', err);
        
        // Notify sender of failure
        socket.emit('messageError', {
          error: 'Failed to send message',
          details: err.message
        });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ currentUserId, targetUserId, isTyping }) => {
      const targetSocketId = connectedUsers.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('userTyping', {
          userId: currentUserId,
          isTyping
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected:', socket.id);
      
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`👋 User ${socket.userId} disconnected`);
      }
      
      console.log(`👥 Remaining users: ${connectedUsers.size}`);
    });
  });
  
  return io; // ✅ Return io instance in case you need it elsewhere
};

module.exports = initializeSocket;