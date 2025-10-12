const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSingnupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const { loginAuth, verifyToken } = require("./middleware/auth");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSingnupData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/login", loginAuth, async (req, res) => {

  const user = req.user
  const token = await user.getJWT();
  // console.log(token);

  //add token to cookie
  res.cookie("token", token, {
    expires: new Date(Date.now()+1*3600000)
  });
  res.send("login suceessfull");
});

app.get("/profile", verifyToken, async (req, res) => {
  res.send(req.user);
});

app.get("/user", async (req, res) => {
  try {
    const data = await User.find({ emailId: req.body.emailId });
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.send("deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong", err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const notAllowedUpdates = ["emailId", "age"];
  try {
    const isNotAllowed = Object.keys(data).some((k) =>
      notAllowedUpdates.includes(k)
    );
    if (isNotAllowed)
      throw new Error(`update not allowed for ${notAllowedUpdates.join(",")}`);

    await User.findByIdAndUpdate(req.params?.userId, data, {
      new: true,
      runValidators: true,
    });
    res.send("Updated sucessfully");
  } catch (err) {
    res.status(400).send("update failed" + err.message);
  }
});

app.post("/sendConnectionRequest", verifyToken, (req, res) => {
  const user = req.user;
  res.send("Connection request send by " + user.firstName);
});

connectDB()
  .then(() => {
    console.log("db connection successful");
    app.listen(3000, () => {
      console.log("server is satrted successfully");
    });
  })
  .catch(() => console.log("connection failed"));
