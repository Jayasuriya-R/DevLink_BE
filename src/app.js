const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http  = require('http');
const initializeSocket = require("./utils/sockets");
 


const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === "http://localhost:5173") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    console.log('Preflight handled');
    // Log what we're actually sending back
    console.log('Response headers:', res.getHeaders());
    return res.status(200).end();
  }

  next();
});
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Set-Cookie"],
//     maxAge: 86400, // 24 hours - cache preflight requests
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routers
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/review"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/feed"));

const server = http.createServer(app)
initializeSocket(server)


connectDB()
  .then(() => {
    console.log("DB connection successful");
    server.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch(() => console.log("Connection failed"));
