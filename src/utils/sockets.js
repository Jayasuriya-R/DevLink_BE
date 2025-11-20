const socket = require("socket.io");

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
    console.log(`📝 User registered - UserID: ${userId}, SocketID: ${socket.id}`);
    console.log(`👥 Total connected users: ${connectedUsers.size}`);
    console.log('Connected users:', Array.from(connectedUsers.keys()));
  });

  
  socket.on('sendMessage', ({ currentUserId, targetUserId, newMsg, firstName }) => {
    console.log('\n📤 SEND MESSAGE EVENT:');
    console.log(`   From: ${currentUserId} (${firstName})`);
    console.log(`   To: ${targetUserId}`);
    console.log(`   Message: "${newMsg.text}"`);
    console.log(`   Sender socket: ${socket.id}`);

   
    const targetSocketId = connectedUsers.get(targetUserId);
    console.log(`   Target socket: ${targetSocketId || 'NOT FOUND'}`);

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
