const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {User} = require("../models/user.js");
const {validateSingnupData} = require("../utils/validation.js")
const streamifier = require("streamifier");
const { loginAuth } = require("../middleware/auth.js");

const authRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

authRouter.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    validateSingnupData(req);
    const { firstName, lastName, emailId, password, age, gender ,shortDescription,skills} = req.body;

    let photoUrl = "";

    if (req.file) {
      // Wrap upload_stream in a Promise to use await
      photoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      shortDescription,
      skills,
      ...(photoUrl && { photoUrl }), // only add photoUrl if available
    });

    await user.save();
    res.status(201).send(
      photoUrl
        ? "User added successfully with image"
        : "User added successfully without image"
    );
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", loginAuth, async (req, res) => {
  const user = req.user;
  const token = await user.getJWT();
  // console.log(token);

  //add token to cookie
  res.cookie("token", token, {
  httpOnly: true,
  secure: true,       
  sameSite: "lax",     
  maxAge: 3600000,     // 1 hour
});
  res.json({message:"login suceessfull",data:user});
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,          
    sameSite: "none",      
    path: "/",             
  });
  
  res.status(200).json({ message: "Logout successful" });
});


module.exports = authRouter;
