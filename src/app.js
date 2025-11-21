const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/sockets");

const app = express();
app.use(express.json());

// --- CORS FIX (Works for local + deployed) ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-link-fe.vercel.app",
  "https://dev-link-fe.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"), false);
      }
    },
    credentials: true,
  })
);

// Handle OPTIONS preflight
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- ROUTES ---
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/review"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/feed"));

// --- SOCKET SERVER ---
const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB connection successful");
    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch(() => console.log("Connection failed"));
