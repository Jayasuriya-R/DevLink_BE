const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

    io.on("Connection",(socket)=>{

        socket.on("joinChat",()=>{});
        socket.on("sendMessage",()=>{});
        socket.on("disconnect",()=>{});

    })

    


}

module.exports = initializeSocket