const express = require("express");
require("dotenv").config();

// Fail fast with a clear message if required env vars are missing,
// instead of crashing deep inside a library with a cryptic error.
const REQUIRED_ENV_VARS = [
  "DB_CONNECTION_SECRET",
  "JWT_SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ZEROBOUNCE_API_KEY",
  "RESEND_API_KEY",
  "EMAIL_FROM",
];

const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error("\n❌ Missing required environment variable(s):");
  missingEnvVars.forEach((key) => console.error(`   - ${key}`));
  console.error(
    "\nSet these in your hosting provider's Environment/Secrets settings (e.g. Render → Environment tab), then redeploy.\n"
  );
  process.exit(1);
}

const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/sockets");

const app = express();

// 🟢 IMPORTANT: Needed for secure cookies on Render / Railway / Vercel
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-link-fe.onrender.com",
  "https://dev-link-fe.vercel.app",
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ROUTES
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/review"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/feed"));
app.use("/", require("./routes/email"));
app.use("/",require("./routes/messages"))

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
