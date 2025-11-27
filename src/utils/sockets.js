const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // ✅ Change to your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

 const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ User connected with socket ID:', socket.id);


  socket.on('register', ({ userId }) => {
    connectedUsers.set(userId, socket.id);
  
  });

  
  socket.on('sendMessage', ({ currentUserId, targetUserId, newMsg, firstName }) => {
    

   
    const targetSocketId = connectedUsers.get(targetUserId);
    

    if (targetSocketId) {

      // save messages to database

      try{
        const chat = Chat.findOne({
          participents:{$all :[currentUserId, targetUserId]}
        })
      }catch(err){
        console.error('Error saving message to database:', err);
      }
      
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
      console.log(`❌ User ${targetUserId} is NOT CONNECTED`);
      console.log(`   Available users: ${Array.from(connectedUsers.keys()).join(', ')}`);
      
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
   
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`👋 User ${userId} disconnected`);
        console.log(`👥 Remaining users: ${connectedUsers.size}`);
        break;
      }
    }
  });
});
  
};

module.exports = initializeSocket;
