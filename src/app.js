const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow requests from your frontend
  if (origin === "http://localhost:5173") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routers
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/review"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/feed"));

connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch(() => console.log("Connection failed"));
