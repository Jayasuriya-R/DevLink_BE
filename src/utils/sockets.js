const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // ✅ Change to your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => { // ✅ Fix: lowercase "connection"
    console.log("User connected:", socket.id);

    socket.on("joinChat", ({ currentUserId, targetUserId }) => {
      const room = [currentUserId, targetUserId].sort().join("_"); // ✅ Add sort() for consistency
      console.log("Joining room:", room);
      socket.join(room);
    });

    socket.on("sendMessage", ({ currentUserId,targetUserId, newMsg }) => {
      console.log("Message received:", newMsg.text);
      const room = [currentUserId, targetUserId].sort().join("_");
      // Broadcast message to the room
      io.to(room).emit("receiveMessage", {
        newMsg:newMsg.text,
        targetUserId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;