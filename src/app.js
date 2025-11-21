const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/sockets");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------------------------
// CORS Configuration
// --------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-link-fe.onrender.com",
  "https://dev-link-fe.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / curl / postman (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/review"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/feed"));



const server = http.createServer(app);
initializeSocket(server);


connectDB()
  .then(() => {
    console.log("DB connection successful");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection failed:", err);
  });
